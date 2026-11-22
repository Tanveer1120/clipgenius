import os
import time
import uuid
import subprocess
import threading
from typing import Dict, Any, Optional
from backend.services.video_service import FFMPEG_BIN, UPLOAD_DIR, probe_video, generate_thumbnail

class StreamRecorder:
    def __init__(self):
        self.active_recordings: Dict[str, Dict[str, Any]] = {}
        self.lock = threading.Lock()

    def start_recording(self, stream_url: str, duration_seconds: int = 30) -> str:
        record_id = str(uuid.uuid4())[:8]
        output_filename = f"stream_{record_id}.mp4"
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        info = {
            "record_id": record_id,
            "stream_url": stream_url,
            "target_duration": duration_seconds,
            "start_time": time.time(),
            "output_path": output_path,
            "output_filename": output_filename,
            "status": "recording",
            "process": None,
            "error": None,
            "completed": False,
            "video_metadata": None
        }

        with self.lock:
            self.active_recordings[record_id] = info

        thread = threading.Thread(target=self._run_ffmpeg_record, args=(record_id, stream_url, duration_seconds, output_path), daemon=True)
        thread.start()
        return record_id

    def _run_ffmpeg_record(self, record_id: str, stream_url: str, duration: int, output_path: str):
        # We record up to duration seconds from stream
        # If stream_url is an RTSP/RTMP/HLS or web stream, ffmpeg handles it directly.
        # Fallback test video stream generator if test stream or offline
        cmd = [
            FFMPEG_BIN,
            "-y",
            "-i", stream_url,
            "-t", str(duration),
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-c:a", "aac",
            output_path
        ]

        # If user passes "demo" or "test", produce a realistic live stream sample
        if stream_url.lower() in ["demo", "test", "sample", "live"]:
            cmd = [
                FFMPEG_BIN,
                "-y",
                "-f", "lavfi", "-i", f"testsrc=duration={duration}:size=1920x1080:rate=30",
                "-f", "lavfi", "-i", f"sine=frequency=1000:duration={duration}",
                "-c:v", "libx264", "-c:a", "aac",
                output_path
            ]

        try:
            process = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
            with self.lock:
                if record_id in self.active_recordings:
                    self.active_recordings[record_id]["process"] = process

            _, stderr = process.communicate()
            
            # If recording completed or was terminated
            if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                meta = probe_video(output_path)
                thumb_path = os.path.join(UPLOAD_DIR, f"{record_id}_thumb.jpg")
                generate_thumbnail(output_path, thumb_path, 1.0)
                
                with self.lock:
                    if record_id in self.active_recordings:
                        rec = self.active_recordings[record_id]
                        rec["status"] = "completed"
                        rec["completed"] = True
                        rec["video_metadata"] = {
                            "video_id": record_id,
                            "filename": rec["output_filename"],
                            "path": output_path,
                            "url": f"/uploads/{rec['output_filename']}",
                            "thumbnail_url": f"/uploads/{record_id}_thumb.jpg",
                            **meta
                        }
            else:
                with self.lock:
                    if record_id in self.active_recordings:
                        self.active_recordings[record_id]["status"] = "failed"
                        self.active_recordings[record_id]["error"] = f"Failed to record stream: {stderr[:200]}"
        except Exception as e:
            with self.lock:
                if record_id in self.active_recordings:
                    self.active_recordings[record_id]["status"] = "failed"
                    self.active_recordings[record_id]["error"] = str(e)

    def stop_recording(self, record_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            rec = self.active_recordings.get(record_id)
            if not rec:
                return None
            proc = rec.get("process")
            if proc and proc.poll() is None:
                proc.terminate()
        
        # Wait briefly for file to finalize
        time.sleep(1)
        return self.get_status(record_id)

    def get_status(self, record_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            rec = self.active_recordings.get(record_id)
            if not rec:
                return None
            elapsed = int(time.time() - rec["start_time"])
            return {
                "record_id": record_id,
                "status": rec["status"],
                "elapsed_seconds": elapsed,
                "target_duration": rec["target_duration"],
                "completed": rec["completed"],
                "error": rec["error"],
                "video_metadata": rec["video_metadata"]
            }

recorder = StreamRecorder()
