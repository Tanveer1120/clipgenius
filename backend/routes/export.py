import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.services.video_service import UPLOAD_DIR, OUTPUT_DIR
from backend.services.render_engine import render_clip_video
from backend.models.schemas import RenderRequest

router = APIRouter(prefix="/api/export", tags=["export"])

@router.post("/render")
async def render_clip_endpoint(req: RenderRequest):
    # Find source video
    video_path = None
    for fname in os.listdir(UPLOAD_DIR):
        if fname.startswith(req.video_id) and not fname.endswith(('_thumb.jpg', '.wav', '.ass')):
            video_path = os.path.join(UPLOAD_DIR, fname)
            break

    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Source video not found")

    try:
        # Construct basic captions if none passed
        captions_data = []
        if req.hook_text:
            captions_data.append({
                "start": 0.0,
                "end": max(2.5, req.hook_duration),
                "text": req.hook_text,
                "words": []
            })

        render_res = render_clip_video(
            video_path=video_path,
            start_time=req.start_time,
            end_time=req.end_time,
            clip_id=req.clip_id,
            resolution=req.resolution,
            crop_mode=req.crop_mode,
            manual_crop_x=req.manual_crop_x or 0.5,
            caption_style=req.caption_style,
            captions=captions_data,
            caption_font_size=req.caption_font_size,
            caption_position_y=req.caption_position_y,
            hook_text=req.hook_text,
            hook_duration=req.hook_duration,
            audio_volume=req.audio_volume,
            bg_music=req.bg_music
        )
        return render_res
    except Exception as e:
        print(f"Render failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_file_endpoint(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Requested export file does not exist")
        
    return FileResponse(
        path=file_path,
        media_type="video/mp4",
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
