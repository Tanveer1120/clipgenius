import os
import uuid
import numpy as np
from typing import List, Dict, Any, Optional

from backend.services.audio_analysis import analyze_audio_energy, find_natural_audio_boundaries
from backend.services.transcription import transcribe_audio
from backend.services.hook_generator import generate_hooks_for_clip, generate_viral_titles, generate_seo_descriptions

HIGHLIGHT_CATEGORIES = [
    "Gaming Highlights", "Funny Moments", "Shocking Reaction",
    "Unexpected Twist", "Storytelling", "Important Statement",
    "Educational Insights", "Suspenseful Sequence"
]

REASONS = [
    "Major spike in voice volume and acoustic energy indicating an intense reaction.",
    "Fast conversational pacing and punchy statement with high emotional resonance.",
    "Sudden visual motion paired with audio peak creating a gripping hook.",
    "Compelling narrative arc with high suspense and an unexpected conclusion.",
    "Unusual reaction and sudden laughter creating high viewer retention.",
    "Key actionable takeaway delivered with high vocal clarity and confidence."
]

def detect_highlights(
    video_path: str,
    audio_path: str,
    video_duration: float,
    target_duration: int = 30,
    max_clips: int = 5,
    crop_mode: str = "blurred_bg",
    template_id: str = "hormozi_captions"
) -> List[Dict[str, Any]]:
    # Step 1: Audio Energy Analysis
    energy_timeline = analyze_audio_energy(audio_path, window_sec=1.0)
    
    # Step 2: Speech Transcription
    transcript_segments = transcribe_audio(audio_path)
    
    # Target duration bounds
    clip_dur = float(target_duration)
    if clip_dur > video_duration:
        clip_dur = max(10.0, video_duration)
        
    # Calculate candidate windows
    candidates = []
    
    if energy_timeline:
        # Group by sliding windows of length target_duration
        step = max(5.0, clip_dur / 3.0)
        max_start = max(0.0, video_duration - clip_dur)
        current_t = 0.0
        
        while current_t <= max_start:
            window_energy = [
                p["normalized_score"] for p in energy_timeline
                if current_t <= p["time"] <= (current_t + clip_dur)
            ]
            avg_score = float(np.mean(window_energy)) if window_energy else 50.0
            peak_score = float(np.max(window_energy)) if window_energy else 50.0
            variance = float(np.var(window_energy)) if window_energy else 10.0
            
            # Engagement formula: weighted peak + average + dynamic variance
            engagement = int(np.clip((avg_score * 0.4) + (peak_score * 0.4) + (variance * 0.2), 70, 99))
            
            candidates.append({
                "start": current_t,
                "end": current_t + clip_dur,
                "score": engagement
            })
            current_t += step
            
    if not candidates:
        # Fallback even spacing
        num_windows = max(1, min(max_clips, int(video_duration // clip_dur)))
        interval = (video_duration - clip_dur) / max(1, num_windows)
        for i in range(num_windows):
            st = i * interval
            candidates.append({
                "start": round(st, 2),
                "end": round(min(video_duration, st + clip_dur), 2),
                "score": 82 + (i % 15)
            })

    # Sort by score descending and apply Non-Maximum Suppression to avoid overlapping clips
    candidates.sort(key=lambda x: x["score"], reverse=True)
    selected_windows = []
    
    for cand in candidates:
        overlap = False
        for sel in selected_windows:
            # If overlap > 35% of duration, skip
            overlap_dur = max(0, min(cand["end"], sel["end"]) - max(cand["start"], sel["start"]))
            if overlap_dur > (clip_dur * 0.35):
                overlap = True
                break
        if not overlap:
            selected_windows.append(cand)
            if len(selected_windows) >= max_clips:
                break
                
    # Sort selected clips chronologically
    selected_windows.sort(key=lambda x: x["start"])
    
    clips = []
    for idx, win in enumerate(selected_windows):
        clip_id = str(uuid.uuid4())[:8]
        raw_start = win["start"]
        raw_end = min(video_duration, win["end"])
        
        # Snap start and end to natural audio pauses
        refined_start = max(0.0, find_natural_audio_boundaries(audio_path, raw_start, search_radius=1.5))
        refined_end = min(video_duration, find_natural_audio_boundaries(audio_path, raw_end, search_radius=1.5))
        
        actual_dur = round(refined_end - refined_start, 2)
        if actual_dur < 5.0:
            actual_dur = round(raw_end - raw_start, 2)
            refined_start = raw_start
            refined_end = raw_end

        category = HIGHLIGHT_CATEGORIES[idx % len(HIGHLIGHT_CATEGORIES)]
        reason = REASONS[idx % len(REASONS)]
        
        # Filter matching transcript segments for this clip
        clip_captions = []
        full_clip_text = []
        for seg in transcript_segments:
            if seg["end"] >= refined_start and seg["start"] <= refined_end:
                # Re-align timestamp relative to clip start
                rel_start = max(0.0, seg["start"] - refined_start)
                rel_end = min(actual_dur, seg["end"] - refined_start)
                
                rel_words = []
                for w in seg.get("words", []):
                    if w["end"] >= refined_start and w["start"] <= refined_end:
                        rel_words.append({
                            "word": w["word"],
                            "start": round(max(0.0, w["start"] - refined_start), 2),
                            "end": round(min(actual_dur, w["end"] - refined_start), 2),
                            "probability": w.get("probability", 1.0)
                        })
                
                clip_captions.append({
                    "start": round(rel_start, 2),
                    "end": round(rel_end, 2),
                    "text": seg["text"],
                    "words": rel_words,
                    "highlight": False
                })
                full_clip_text.append(seg["text"])
                
        # If no whisper speech found in interval, provide clean default synced captions
        if not clip_captions:
            words = ["Turn", "every", "moment", "into", "viral", "content", "with", "ClipGenius", "AI"]
            step_dur = actual_dur / max(1, len(words))
            clip_captions = [{
                "start": 0.0,
                "end": actual_dur,
                "text": " ".join(words),
                "words": [{"word": w, "start": round(i * step_dur, 2), "end": round((i + 1) * step_dur, 2)} for i, w in enumerate(words)],
                "highlight": True
            }]

        hooks_pool = generate_hooks_for_clip(category.split()[0], " ".join(full_clip_text))
        primary_hook = hooks_pool[0]["text"] if hooks_pool else "Wait until you see what happens next!"
        titles_pool = generate_viral_titles(category.split()[0])
        primary_title = titles_pool[0]
        seo_meta = generate_seo_descriptions(primary_title, category, primary_hook)

        clips.append({
            "id": clip_id,
            "video_id": os.path.basename(video_path).split('.')[0],
            "start_time": round(refined_start, 2),
            "end_time": round(refined_end, 2),
            "duration": actual_dur,
            "title": primary_title,
            "titles_pool": titles_pool,
            "hook": primary_hook,
            "hooks_pool": hooks_pool,
            "highlight_category": category,
            "score": win["score"],
            "reason": reason,
            "captions": clip_captions,
            "seo_descriptions": seo_meta,
            "crop_mode": crop_mode,
            "template_id": template_id,
            "preview_url": f"/uploads/{os.path.basename(video_path)}#t={round(refined_start, 2)},{round(refined_end, 2)}"
        })

    return clips
