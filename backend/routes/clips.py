import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from backend.services.video_service import UPLOAD_DIR, probe_video
from backend.services.highlight_detector import detect_highlights
from backend.services.hook_generator import generate_hooks_for_clip, generate_viral_titles
from backend.models.schemas import ClipAnalysisRequest, Clip

router = APIRouter(prefix="/api/clips", tags=["clips"])

class RegenerateRequest(BaseModel):
    category: str = "Curiosity"
    transcript_text: Optional[str] = ""

@router.post("/generate", response_model=List[Clip])
async def generate_clips_endpoint(req: ClipAnalysisRequest):
    # Locate video file
    video_path = None
    for fname in os.listdir(UPLOAD_DIR):
        if fname.startswith(req.video_id) and not fname.endswith(('_thumb.jpg', '.wav', '.ass')):
            video_path = os.path.join(UPLOAD_DIR, fname)
            break

    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    audio_path = os.path.join(UPLOAD_DIR, f"{req.video_id}.wav")
    meta = probe_video(video_path)
    video_dur = meta.get("duration", 30.0)

    try:
        clips = detect_highlights(
            video_path=video_path,
            audio_path=audio_path,
            video_duration=video_dur,
            target_duration=req.target_duration,
            max_clips=req.max_clips,
            crop_mode=req.crop_mode,
            template_id=req.template_id
        )
        return clips
    except Exception as e:
        print(f"Error generating clips: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/regenerate-titles")
async def regenerate_titles_endpoint(req: RegenerateRequest):
    titles = generate_viral_titles(req.category, req.transcript_text or "")
    return {"titles": titles}

@router.post("/regenerate-hooks")
async def regenerate_hooks_endpoint(req: RegenerateRequest):
    hooks = generate_hooks_for_clip(req.category, req.transcript_text or "")
    return {"hooks": hooks}
