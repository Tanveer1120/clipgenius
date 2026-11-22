from fastapi import APIRouter, HTTPException
from backend.services.templates_data import TEMPLATES
from backend.services.caption_generator import CAPTION_STYLES

router = APIRouter(prefix="/api/templates", tags=["templates"])

@router.get("")
async def get_all_templates():
    return TEMPLATES

@router.get("/styles")
async def get_caption_styles():
    return [
        {"id": k, **v} for k, v in CAPTION_STYLES.items()
    ]

@router.get("/{template_id}")
async def get_single_template(template_id: str):
    tpl = next((t for t in TEMPLATES if t["id"] == template_id), None)
    if not tpl:
        raise HTTPException(status_code=404, detail="Template not found")
    return tpl
