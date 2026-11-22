import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from backend.services.video_service import (
    UPLOAD_DIR, probe_video, generate_thumbnail, extract_audio, download_video_url
)
from backend.services.stream_recorder import recorder
from backend.models.schemas import UrlImportRequest, StreamRecordRequest

router = APIRouter(prefix="/api/video", tags=["video"])

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".mkv", ".avi", ".webm"}

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported format {ext}. Supported formats: MP4, MOV, MKV, AVI, WEBM")

    video_id = str(uuid.uuid4())[:8]
    saved_filename = f"{video_id}{ext}"
    video_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    meta = probe_video(video_path)
    
    # Generate thumbnail
    thumb_filename = f"{video_id}_thumb.jpg"
    thumb_path = os.path.join(UPLOAD_DIR, thumb_filename)
    generate_thumbnail(video_path, thumb_path, min(1.0, meta["duration"] / 2))

    # Pre-extract audio for whisper & energy analysis
    audio_filename = f"{video_id}.wav"
    audio_path = os.path.join(UPLOAD_DIR, audio_filename)
    extract_audio(video_path, audio_path)

    return {
        "video_id": video_id,
        "filename": file.filename,
        "saved_filename": saved_filename,
        "path": video_path,
        "url": f"/uploads/{saved_filename}",
        "thumbnail_url": f"/uploads/{thumb_filename}",
        **meta
    }

@router.post("/import-url")
async def import_url(req: UrlImportRequest):
    if not req.url or not req.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    try:
        data = download_video_url(req.url.strip())
        video_id = data["video_id"]
        # Extract audio
        audio_filename = f"{video_id}.wav"
        audio_path = os.path.join(UPLOAD_DIR, audio_filename)
        extract_audio(data["path"], audio_path)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/record-stream")
async def start_stream_record(req: StreamRecordRequest):
    if not req.stream_url or not req.stream_url.strip():
        raise HTTPException(status_code=400, detail="Stream URL cannot be empty")
    rec_id = recorder.start_recording(req.stream_url.strip(), req.duration_seconds)
    return {"record_id": rec_id, "status": "recording", "duration": req.duration_seconds}

@router.get("/stream-status/{record_id}")
async def get_stream_status(record_id: str):
    status = recorder.get_status(record_id)
    if not status:
        raise HTTPException(status_code=404, detail="Recording session not found")
    
    # If completed and has metadata, extract audio if not yet extracted
    if status.get("completed") and status.get("video_metadata"):
        video_path = status["video_metadata"]["path"]
        video_id = status["video_metadata"]["video_id"]
        audio_path = os.path.join(UPLOAD_DIR, f"{video_id}.wav")
        if not os.path.exists(audio_path):
            extract_audio(video_path, audio_path)
            
    return status

@router.post("/stop-stream/{record_id}")
async def stop_stream_record(record_id: str):
    status = recorder.stop_recording(record_id)
    if not status:
        raise HTTPException(status_code=404, detail="Recording session not found")
    return status
