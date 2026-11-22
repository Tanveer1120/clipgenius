import cv2
import numpy as np
import os
from typing import List, Dict, Any, Tuple

def get_face_cascade():
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    return cv2.CascadeClassifier(cascade_path)

def analyze_subject_tracking(video_path: str, start_time: float, duration: float, sample_fps: float = 2.0) -> Dict[str, Any]:
    """
    Analyzes video to compute smooth 9:16 crop box coordinates centered on detected faces or key subjects.
    Output aspect ratio is 9:16 (width = height * 9 / 16).
    """
    if not os.path.exists(video_path):
        return {"default_center_x": 0.5, "tracking_points": []}

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"default_center_x": 0.5, "tracking_points": []}

    video_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

    target_crop_w = int(video_h * (9.0 / 16.0))
    if target_crop_w > video_w:
        target_crop_w = video_w
    
    face_cascade = get_face_cascade()
    tracking_points = []
    
    step_frames = max(1, int(fps / sample_fps))
    start_frame = int(start_time * fps)
    total_frames = int(duration * fps)
    
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    
    raw_centers = []
    current_center = video_w / 2.0
    alpha = 0.25 # EMA smoothing factor
    
    for f in range(0, total_frames, step_frames):
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame + f)
        ret, frame = cap.read()
        if not ret:
            break
        
        t = start_time + (f / fps)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4, minSize=(60, 60))
        
        target_x = video_w / 2.0 # default center
        if len(faces) > 0:
            # Pick largest face (closest/main speaker)
            faces = sorted(faces, key=lambda b: b[2] * b[3], reverse=True)
            fx, fy, fw, fh = faces[0]
            target_x = fx + (fw / 2.0)
            
        current_center = alpha * target_x + (1.0 - alpha) * current_center
        
        # Clamp crop box so it stays inside frame
        min_x = target_crop_w / 2.0
        max_x = video_w - (target_crop_w / 2.0)
        clamped_center = np.clip(current_center, min_x, max_x)
        
        normalized_center_x = clamped_center / float(video_w)
        
        tracking_points.append({
            "time": round(t, 2),
            "center_x": round(float(clamped_center), 1),
            "normalized_x": round(float(normalized_center_x), 3),
            "crop_w": target_crop_w,
            "crop_h": video_h,
            "crop_x": int(clamped_center - (target_crop_w / 2.0)),
            "crop_y": 0
        })

    cap.release()

    default_norm_x = 0.5
    if tracking_points:
        default_norm_x = np.mean([p["normalized_x"] for p in tracking_points])

    return {
        "video_w": video_w,
        "video_h": video_h,
        "crop_w": target_crop_w,
        "crop_h": video_h,
        "default_center_x": round(float(default_norm_x), 3),
        "tracking_points": tracking_points
    }
