import os
import sys
import json
import uuid
import subprocess
import shutil
from typing import Dict, Any, Optional
import requests

def get_binary(name: str) -> str:
    # First check project workspace root
    proj_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    root_bin = os.path.join(proj_root, f"{name}.exe" if sys.platform == "win32" else name)
    if os.path.exists(root_bin):
        return root_bin

    # Next check alongside python.exe
    py_dir = os.path.dirname(sys.executable)
    local_path = os.path.join(py_dir, f"{name}.exe" if sys.platform == "win32" else name)
    if os.path.exists(local_path):
        return local_path
    
    # Check standard PATH
    which_path = shutil.which(name)
    if which_path:
        return which_path
    
    # Check common winget install locations on Windows
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    if local_app_data:
        winget_pattern = os.path.join(local_app_data, "Microsoft", "WinGet", "Packages")
        if os.path.exists(winget_pattern):
            for root, dirs, files in os.walk(winget_pattern):
                if f"{name}.exe" in files:
                    return os.path.join(root, f"{name}.exe")
    
    return name

FFMPEG_BIN = get_binary("ffmpeg")
FFPROBE_BIN = get_binary("ffprobe")

# Vercel serverless filesystem is read-only except /tmp
if os.environ.get("VERCEL") == "1":
    UPLOAD_DIR = "/tmp/uploads"
    OUTPUT_DIR = "/tmp/outputs"
    TEMP_DIR = "/tmp/temp"
else:
    UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
    OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "outputs"))
    TEMP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "temp"))

for d in [UPLOAD_DIR, OUTPUT_DIR, TEMP_DIR]:
    os.makedirs(d, exist_ok=True)

def probe_video(video_path: str) -> Dict[str, Any]:
    cmd = [
        FFPROBE_BIN,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        video_path
    ]
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        data = json.loads(result.stdout)
        
        video_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
        audio_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "audio"), None)
        format_info = data.get("format", {})
        
        duration = float(format_info.get("duration", 0.0))
        if duration == 0 and video_stream:
            duration = float(video_stream.get("duration", 0.0))
            
        width = int(video_stream.get("width", 1920)) if video_stream else 1920
        height = int(video_stream.get("height", 1080)) if video_stream else 1080
        
        fps = 30.0
        if video_stream and "r_frame_rate" in video_stream:
            parts = video_stream["r_frame_rate"].split('/')
            if len(parts) == 2 and float(parts[1]) > 0:
                fps = float(parts[0]) / float(parts[1])
            elif len(parts) == 1:
                fps = float(parts[0])

        size_bytes = int(format_info.get("size", os.path.getsize(video_path) if os.path.exists(video_path) else 0))
        
        return {
            "duration": round(duration, 2),
            "width": width,
            "height": height,
            "fps": round(fps, 2),
            "format": format_info.get("format_name", "mp4"),
            "size_bytes": size_bytes,
            "has_audio": audio_stream is not None
        }
    except Exception as e:
        print(f"Error probing video {video_path}: {e}")
        return {
            "duration": 30.0,
            "width": 1920,
            "height": 1080,
            "fps": 30.0,
            "format": "mp4",
            "size_bytes": os.path.getsize(video_path) if os.path.exists(video_path) else 0,
            "has_audio": True
        }

def generate_thumbnail(video_path: str, output_path: str, timestamp: float = 1.0) -> bool:
    cmd = [
        FFMPEG_BIN,
        "-y",
        "-ss", str(timestamp),
        "-i", video_path,
        "-vframes", "1",
        "-q:v", "2",
        output_path
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return os.path.exists(output_path)
    except Exception as e:
        print(f"Error generating thumbnail: {e}")
        return False

def extract_audio(video_path: str, output_audio_path: str) -> bool:
    cmd = [
        FFMPEG_BIN,
        "-y",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        output_audio_path
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return os.path.exists(output_audio_path)
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return False

def download_video_url(url: str, progress_callback=None) -> Dict[str, Any]:
    video_id = str(uuid.uuid4())[:8]
    output_filename = f"{video_id}.mp4"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    # Check if direct mp4/webm/mov file link
    lower_url = url.lower().split("?")[0]
    if lower_url.endswith((".mp4", ".mov", ".mkv", ".webm", ".avi")):
        try:
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            total_size = int(r.headers.get('content-length', 0))
            downloaded = 0
            with open(output_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if progress_callback and total_size > 0:
                            progress_callback(min(99, int((downloaded / total_size) * 100)))
            meta = probe_video(output_path)
            thumb_path = os.path.join(UPLOAD_DIR, f"{video_id}_thumb.jpg")
            generate_thumbnail(output_path, thumb_path, min(1.0, meta["duration"] / 2))
            return {
                "video_id": video_id,
                "filename": output_filename,
                "path": output_path,
                "url": f"/uploads/{output_filename}",
                "thumbnail_url": f"/uploads/{video_id}_thumb.jpg",
                **meta
            }
        except Exception as e:
            print(f"Direct download failed: {e}")

    # Use yt-dlp for video platforms
    try:
        import yt_dlp
        
        def ydl_hook(d):
            if d['status'] == 'downloading' and progress_callback:
                total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
                downloaded = d.get('downloaded_bytes', 0)
                if total > 0:
                    pct = int((downloaded / total) * 100)
                    progress_callback(pct)

        ydl_opts = {
            'outtmpl': os.path.join(UPLOAD_DIR, f"{video_id}.%(ext)s"),
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'merge_output_format': 'mp4',
            'progress_hooks': [ydl_hook],
            'ffmpeg_location': os.path.dirname(FFMPEG_BIN),
            'max_filesize': 500 * 1024 * 1024, # 500MB safety limit
            'noplaylist': True,
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            
        final_mp4 = os.path.join(UPLOAD_DIR, f"{video_id}.mp4")
        if not os.path.exists(final_mp4):
            # Check if downloaded with another extension
            for fname in os.listdir(UPLOAD_DIR):
                if fname.startswith(video_id) and not fname.endswith(('_thumb.jpg', '.wav')):
                    final_mp4 = os.path.join(UPLOAD_DIR, fname)
                    break

        meta = probe_video(final_mp4)
        thumb_path = os.path.join(UPLOAD_DIR, f"{video_id}_thumb.jpg")
        generate_thumbnail(final_mp4, thumb_path, min(2.0, meta["duration"] / 2))
        
        return {
            "video_id": video_id,
            "filename": os.path.basename(final_mp4),
            "path": final_mp4,
            "url": f"/uploads/{os.path.basename(final_mp4)}",
            "thumbnail_url": f"/uploads/{video_id}_thumb.jpg",
            **meta
        }
    except Exception as e:
        raise RuntimeError(f"Could not extract video from link: {str(e)}. If this platform restricts automated downloads, please upload the video file directly.")
