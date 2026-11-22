from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class VideoMetadata(BaseModel):
    video_id: str
    filename: str
    duration: float
    width: int
    height: int
    fps: float
    format: str
    size_bytes: int
    path: str
    url: str
    thumbnail_url: str

class UrlImportRequest(BaseModel):
    url: str

class StreamRecordRequest(BaseModel):
    stream_url: str
    duration_seconds: int = 15

class StreamRecordStatus(BaseModel):
    recording: bool
    elapsed_seconds: int
    stream_url: str
    video_id: Optional[str] = None
    message: str = ""

class CaptionSegment(BaseModel):
    start: float
    end: float
    text: str
    words: Optional[List[Dict[str, Any]]] = None
    highlight: bool = False

class ClipAnalysisRequest(BaseModel):
    video_id: str
    target_duration: int = 30 # 15, 30, 45, 60, 90
    max_clips: int = 5
    crop_mode: str = "blurred_bg" # smart_crop, blurred_bg, zoom_fill, gaming, podcast
    template_id: str = "hormozi_captions"

class Clip(BaseModel):
    id: str
    video_id: str
    start_time: float
    end_time: float
    duration: float
    title: str
    titles_pool: List[str] = []
    hook: str
    hooks_pool: List[Dict[str, str]] = []
    highlight_category: str
    score: int
    reason: str
    captions: List[CaptionSegment] = []
    seo_descriptions: Dict[str, Any] = {}
    crop_mode: str = "blurred_bg"
    template_id: str = "hormozi_captions"
    preview_url: str
    rendered_url: Optional[str] = None
    rendered_1080p: Optional[str] = None
    rendered_720p: Optional[str] = None

class RenderRequest(BaseModel):
    clip_id: str
    video_id: str
    start_time: float
    end_time: float
    resolution: str = "1080p" # 1080p, 720p
    crop_mode: str = "blurred_bg" # smart_crop, blurred_bg, zoom_fill, original_extended, manual
    manual_crop_x: Optional[float] = 0.5 # 0.0 to 1.0 (center)
    caption_style: str = "hormozi"
    caption_font: str = "Montserrat"
    caption_color: str = "#FFFFFF"
    caption_highlight_color: str = "#FFE600"
    caption_position_y: float = 75.0 # percent from top
    caption_font_size: int = 42
    hook_text: str = ""
    hook_style: str = "curiosity"
    hook_duration: float = 3.5
    template_id: Optional[str] = "hormozi_captions"
    audio_volume: float = 1.0
    bg_music: Optional[str] = None
    bg_music_volume: float = 0.2
    sound_effect: Optional[str] = "whoosh"

class TemplateDefinition(BaseModel):
    id: str
    name: str
    category: str # gaming, podcast, entertainment, educational
    description: str
    caption_style: str
    font: str
    primary_color: str
    accent_color: str
    crop_mode: str
    hook_style: str
    sound_effect: Optional[str]
    bg_music: Optional[str]
    preview_gradient: str

class ProjectInfo(BaseModel):
    id: str
    name: str
    created_at: str
    video_id: str
    clips: List[Clip] = []
    settings: Dict[str, Any] = {}
