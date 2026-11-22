import os
import sys
import subprocess
import uuid
import re
from typing import Dict, Any, Optional

from backend.services.video_service import FFMPEG_BIN, OUTPUT_DIR, TEMP_DIR, probe_video
from backend.services.caption_generator import generate_ass_subtitle_file
from backend.services.face_tracking import analyze_subject_tracking

def ensure_fontconfig() -> str:
    fonts_conf = os.path.join(TEMP_DIR, "fonts.conf")
    if not os.path.exists(fonts_conf):
        xml_content = (
            '<?xml version="1.0"?>\n'
            '<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n'
            '<fontconfig>\n'
            '  <dir>C:\\Windows\\Fonts</dir>\n'
            '  <cachedir>' + TEMP_DIR.replace("\\", "/") + '</cachedir>\n'
            '</fontconfig>\n'
        )
        with open(fonts_conf, "w", encoding="utf-8") as f:
            f.write(xml_content)
    return fonts_conf

def escape_ffmpeg_path(p: str) -> str:
    try:
        rel = os.path.relpath(p)
        return rel.replace("\\", "/")
    except Exception:
        return p.replace("\\", "/").replace(":", "\\:")

def escape_drawtext(text: str) -> str:
    return text.replace(":", "\\:").replace("'", "\\'").replace("%", "\\%").replace("\n", " ")

def render_clip_video(
    video_path: str,
    start_time: float,
    end_time: float,
    clip_id: str,
    resolution: str = "1080p",
    crop_mode: str = "blurred_bg",
    manual_crop_x: float = 0.5,
    caption_style: str = "hormozi",
    captions: list = None,
    caption_font_size: int = 44,
    caption_position_y: float = 75.0,
    hook_text: str = "",
    hook_duration: float = 3.5,
    audio_volume: float = 1.0,
    bg_music: Optional[str] = None,
    progress_callback = None
) -> Dict[str, Any]:
    duration = max(1.0, end_time - start_time)
    
    # Target resolution
    if resolution == "720p":
        target_w, target_h = 720, 1280
    else:
        target_w, target_h = 1080, 1920
        
    output_filename = f"{clip_id}_{resolution}.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    # 1. Generate ASS Subtitles & Hook Overlay
    ass_path = os.path.join(TEMP_DIR, f"{clip_id}.ass")
    has_subtitles = False
    if captions or hook_text:
        generate_ass_subtitle_file(
            captions=captions or [],
            output_ass_path=ass_path,
            style_key=caption_style,
            video_width=target_w,
            video_height=target_h,
            custom_font_size=caption_font_size,
            position_y_pct=caption_position_y,
            hook_text=hook_text,
            hook_duration=hook_duration
        )
        has_subtitles = os.path.exists(ass_path)
        
    # 2. Build Video Filter Graph for 9:16 Conversion
    meta = probe_video(video_path)
    orig_w = meta["width"]
    orig_h = meta["height"]
    
    filter_chains = []
    
    if crop_mode == "smart_crop":
        # Calculate optimal crop X
        track_info = analyze_subject_tracking(video_path, start_time, duration, sample_fps=1.0)
        norm_center_x = manual_crop_x if (manual_crop_x and manual_crop_x != 0.5) else track_info.get("default_center_x", 0.5)
        
        target_crop_w = int(orig_h * (9.0 / 16.0))
        if target_crop_w > orig_w:
            target_crop_w = orig_w
        crop_x = int(np_clip_val((norm_center_x * orig_w) - (target_crop_w / 2.0), 0, orig_w - target_crop_w))
        
        # Crop then scale to 1080x1920
        vf_base = f"crop={target_crop_w}:{orig_h}:{crop_x}:0,scale={target_w}:{target_h}"
        filter_chains.append(vf_base)
        
    elif crop_mode == "zoom_fill":
        # Scale to cover 9:16 and crop center
        vf_base = f"scale=-1:{target_h},crop={target_w}:{target_h}:(iw-{target_w})/2:0"
        filter_chains.append(vf_base)
        
    elif crop_mode == "split_screen":
        # Podcast split screen: top and bottom halves
        vf_base = f"[0:v]crop=iw/2:ih:0:0,scale={target_w}:{target_h//2}[top];[0:v]crop=iw/2:ih:iw/2:0,scale={target_w}:{target_h//2}[bot];[top][bot]vstack"
        filter_chains.append(vf_base)
        
    else:
        # Default: Blurred Background (Standard of OpusClip, Vizard, Submagic)
        # Background: scaled & cropped to 1080x1920 with heavy boxblur
        # Foreground: crisp original aspect ratio centered
        escaped_blur = f"boxblur=25:5"
        filter_chains.append(
            f"[0:v]scale={target_w}:{target_h}:force_original_aspect_ratio=increase,crop={target_w}:{target_h},{escaped_blur}[bg];"
            f"[0:v]scale={target_w}:-2[fg];"
            f"[bg][fg]overlay=(W-w)/2:(H-h)/2"
        )

    # Combine video filters
    current_filter = "".join(filter_chains)
    if has_subtitles:
        escaped_sub = escape_ffmpeg_path(ass_path)
        current_filter += f",subtitles={escaped_sub}"

    # Audio filters
    af_chain = []
    if audio_volume != 1.0:
        af_chain.append(f"volume={audio_volume}")
    af_str = ",".join(af_chain) if af_chain else "anull"

    cmd = [
        FFMPEG_BIN,
        "-y",
        "-ss", str(start_time),
        "-t", str(duration),
        "-i", video_path,
        "-filter_complex" if (crop_mode == "blurred_bg" or crop_mode == "split_screen") else "-vf",
        current_filter,
        "-af", af_str,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "22",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        output_path
    ]

    env = os.environ.copy()
    fc_file = ensure_fontconfig()
    env["FONTCONFIG_FILE"] = fc_file
    env["FONTCONFIG_PATH"] = TEMP_DIR

    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
            universal_newlines=True,
            env=env
        )
        
        # Read stderr to parse progress
        time_pattern = re.compile(r"time=(\d+):(\d+):(\d+\.\d+)")
        stderr_lines = []
        while proc.poll() is None:
            line = proc.stderr.readline()
            if not line:
                continue
            stderr_lines.append(line)
            match = time_pattern.search(line)
            if match and progress_callback:
                h, m, s = match.groups()
                cur_sec = int(h) * 3600 + int(m) * 60 + float(s)
                pct = min(99, int((cur_sec / duration) * 100))
                progress_callback(pct)

        # Grab remaining output
        rest, _ = proc.communicate()
        if rest:
            stderr_lines.append(rest)
        
        if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
            if progress_callback:
                progress_callback(100)
            return {
                "success": True,
                "output_path": output_path,
                "output_filename": output_filename,
                "url": f"/outputs/{output_filename}",
                "resolution": resolution,
                "size_bytes": os.path.getsize(output_path)
            }
        else:
            recent_err = "".join(stderr_lines[-20:])
            raise RuntimeError(f"FFmpeg rendering produced empty file: {recent_err}")
    except Exception as e:
        print(f"Render error: {e}")
        raise e

def np_clip_val(val, min_v, max_v):
    return max(min_v, min(max_v, val))
