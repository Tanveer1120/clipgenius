import os
from typing import List, Dict, Any

CAPTION_STYLES = {
    "hormozi": {
        "name": "Hormozi Style",
        "fontname": "Montserrat",
        "fontsize": 44,
        "primary_color": "&H00FFFFFF",      # White
        "secondary_color": "&H0000E6FF",    # Bright Yellow BGR
        "outline_color": "&H00000000",      # Black border
        "back_color": "&H80000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 2,
        "alignment": 2, # Bottom center
        "margin_v": 160,
        "uppercase": True
    },
    "mrbeast": {
        "name": "MrBeast Style",
        "fontname": "Impact",
        "fontsize": 48,
        "primary_color": "&H0000FFFF",      # Vivid Yellow
        "secondary_color": "&H0033FF33",    # Neon Green
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 5,
        "shadow": 3,
        "alignment": 2,
        "margin_v": 170,
        "uppercase": True
    },
    "gaming": {
        "name": "Gaming Style",
        "fontname": "Arial",
        "fontsize": 42,
        "primary_color": "&H00FFFF00",      # Cyan
        "secondary_color": "&H00FF00FF",    # Magenta
        "outline_color": "&H002A0845",      # Deep purple outline
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 4,
        "alignment": 2,
        "margin_v": 150,
        "uppercase": True
    },
    "podcast": {
        "name": "Podcast Style",
        "fontname": "Arial",
        "fontsize": 38,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H00E0E0E0",
        "outline_color": "&H00000000",
        "back_color": "&H99000000",         # Semi-opaque black box
        "bold": 0,
        "italic": 0,
        "border_style": 3,                  # Opaque box
        "outline": 0,
        "shadow": 0,
        "alignment": 2,
        "margin_v": 140,
        "uppercase": False
    },
    "karaoke": {
        "name": "Karaoke Style",
        "fontname": "Montserrat",
        "fontsize": 42,
        "primary_color": "&H0000FFFF",      # Highlight
        "secondary_color": "&H00FFFFFF",
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 2,
        "alignment": 2,
        "margin_v": 150,
        "uppercase": False
    },
    "minimal_white": {
        "name": "Minimal White",
        "fontname": "Segoe UI",
        "fontsize": 36,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H00CCCCCC",
        "outline_color": "&H40000000",
        "back_color": "&H00000000",
        "bold": 0,
        "italic": 0,
        "border_style": 1,
        "outline": 2,
        "shadow": 1,
        "alignment": 2,
        "margin_v": 130,
        "uppercase": False
    },
    "neon": {
        "name": "Neon Style",
        "fontname": "Impact",
        "fontsize": 44,
        "primary_color": "&H00FF00FF",      # Magenta Neon
        "secondary_color": "&H00FFFF00",    # Cyan
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 5,
        "alignment": 2,
        "margin_v": 155,
        "uppercase": True
    },
    "bold_yellow": {
        "name": "Bold Yellow",
        "fontname": "Arial Black",
        "fontsize": 44,
        "primary_color": "&H0000E6FF",      # Yellow
        "secondary_color": "&H00FFFFFF",
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 3,
        "alignment": 2,
        "margin_v": 160,
        "uppercase": True
    },
    "cinematic": {
        "name": "Cinematic Style",
        "fontname": "Georgia",
        "fontsize": 36,
        "primary_color": "&H00F0E6D2",      # Pale Gold
        "secondary_color": "&H00FFFFFF",
        "outline_color": "&H80000000",
        "back_color": "&H00000000",
        "bold": 0,
        "italic": 1,
        "border_style": 1,
        "outline": 2,
        "shadow": 2,
        "alignment": 2,
        "margin_v": 120,
        "uppercase": False
    },
    "professional": {
        "name": "Professional Style",
        "fontname": "Segoe UI",
        "fontsize": 38,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H00FF9933",
        "outline_color": "&H001A1A1A",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 2,
        "shadow": 1,
        "alignment": 2,
        "margin_v": 140,
        "uppercase": False
    },
    "tiktok": {
        "name": "TikTok Style",
        "fontname": "Arial",
        "fontsize": 42,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H0000FFFF",
        "outline_color": "&H00000000",
        "back_color": "&HB0000000",
        "bold": 1,
        "italic": 0,
        "border_style": 3,
        "outline": 0,
        "shadow": 0,
        "alignment": 2,
        "margin_v": 150,
        "uppercase": False
    },
    "animated_highlight": {
        "name": "Animated Word Highlight",
        "fontname": "Montserrat",
        "fontsize": 44,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H0000E6FF",
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 2,
        "alignment": 2,
        "margin_v": 160,
        "uppercase": True
    },
    "rainbow": {
        "name": "Rainbow Captions",
        "fontname": "Arial Black",
        "fontsize": 42,
        "primary_color": "&H00FF66CC",      # Multi-tone pink/cyan
        "secondary_color": "&H0033CCFF",
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 4,
        "shadow": 3,
        "alignment": 2,
        "margin_v": 150,
        "uppercase": True
    },
    "meme": {
        "name": "Meme Captions",
        "fontname": "Impact",
        "fontsize": 50,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H00FFFFFF",
        "outline_color": "&H00000000",
        "back_color": "&H00000000",
        "bold": 1,
        "italic": 0,
        "border_style": 1,
        "outline": 5,
        "shadow": 2,
        "alignment": 8, # Top center for classic meme text
        "margin_v": 100,
        "uppercase": True
    },
    "clean_subtitle": {
        "name": "Clean Subtitle Style",
        "fontname": "Arial",
        "fontsize": 34,
        "primary_color": "&H00FFFFFF",
        "secondary_color": "&H00FFFFFF",
        "outline_color": "&H00000000",
        "back_color": "&H80000000",
        "bold": 0,
        "italic": 0,
        "border_style": 1,
        "outline": 2,
        "shadow": 1,
        "alignment": 2,
        "margin_v": 110,
        "uppercase": False
    }
}

def format_ass_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int(round((seconds - int(seconds)) * 100))
    if centis >= 100:
        centis = 99
    return f"{hours}:{minutes:02d}:{secs:02d}.{centis:02d}"

def generate_ass_subtitle_file(
    captions: List[Dict[str, Any]],
    output_ass_path: str,
    style_key: str = "hormozi",
    video_width: int = 1080,
    video_height: int = 1920,
    custom_font_size: int = None,
    position_y_pct: float = 75.0,
    hook_text: str = "",
    hook_duration: float = 3.5
) -> str:
    cfg = CAPTION_STYLES.get(style_key, CAPTION_STYLES["hormozi"]).copy()
    
    fontsize = custom_font_size if custom_font_size else cfg["fontsize"]
    margin_v = int(video_height * (1.0 - (position_y_pct / 100.0)))
    
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {video_width}
PlayResY: {video_height}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{cfg['fontname']},{fontsize},{cfg['primary_color']},{cfg['secondary_color']},{cfg['outline_color']},{cfg['back_color']},{cfg['bold']},{cfg['italic']},0,0,100,100,0,0,{cfg['border_style']},{cfg['outline']},{cfg['shadow']},{cfg['alignment']},60,60,{margin_v},1
Style: Highlight,{cfg['fontname']},{int(fontsize * 1.15)},{cfg['secondary_color']},{cfg['primary_color']},{cfg['outline_color']},{cfg['back_color']},{cfg['bold']},{cfg['italic']},0,0,100,100,0,0,{cfg['border_style']},{cfg['outline'] + 1},{cfg['shadow']},{cfg['alignment']},60,60,{margin_v},1
Style: HookBanner,Impact,48,&H0000FFFF,&H00FFFFFF,&H00000000,&H90000000,1,0,0,0,100,100,0,0,1,5,3,8,80,80,240,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []

    # Insert viral hook banner in top center during opening duration
    if hook_text and hook_text.strip():
        t_hook_end = format_ass_time(hook_duration)
        clean_hook = hook_text.strip().replace("\n", " ").upper()
        events.append(f"Dialogue: 0,0:00:00.00,{t_hook_end},HookBanner,,0,0,0,,{{\\an8\\bord5\\shad3}}{clean_hook}")
    
    for cap in captions:
        t_start = format_ass_time(cap["start"])
        t_end = format_ass_time(cap["end"])
        
        words = cap.get("words", [])
        if words and (style_key in ["hormozi", "animated_highlight", "karaoke", "mrbeast"]):
            # Split into 3-word chunks for punchy viral short pacing
            chunk_size = 3
            for i in range(0, len(words), chunk_size):
                chunk = words[i : i + chunk_size]
                c_start = format_ass_time(chunk[0]["start"])
                c_end = format_ass_time(chunk[-1]["end"])
                
                # Active word highlight styling
                formatted_words = []
                for w_idx, w in enumerate(chunk):
                    w_text = w["word"].upper() if cfg["uppercase"] else w["word"]
                    if w_idx == 0:
                        formatted_words.append(f"{{\\c{cfg['secondary_color']}}}{w_text}{{\\r}}")
                    else:
                        formatted_words.append(w_text)
                        
                events.append(f"Dialogue: 0,{c_start},{c_end},Default,,0,0,0,,{' '.join(formatted_words)}")
        else:
            text = cap.get("text", "")
            if cfg["uppercase"]:
                text = text.upper()
            events.append(f"Dialogue: 0,{t_start},{t_end},Default,,0,0,0,,{text}")

    content = header + "\n".join(events) + "\n"
    with open(output_ass_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    return output_ass_path
