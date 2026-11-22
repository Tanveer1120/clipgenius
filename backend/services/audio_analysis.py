import os
import numpy as np
from scipy.io import wavfile
from typing import List, Dict, Any, Tuple

def analyze_audio_energy(audio_path: str, window_sec: float = 0.5) -> List[Dict[str, Any]]:
    if not os.path.exists(audio_path):
        return []
    
    try:
        sample_rate, data = wavfile.read(audio_path)
        if len(data.shape) > 1:
            data = data.mean(axis=1) # convert stereo to mono
        
        # Normalize to float between -1.0 and 1.0
        if data.dtype == np.int16:
            data = data.astype(np.float32) / 32768.0
        elif data.dtype == np.int32:
            data = data.astype(np.float32) / 2147483648.0

        total_samples = len(data)
        window_size = int(sample_rate * window_sec)
        if window_size <= 0:
            return []

        num_windows = total_samples // window_size
        energy_timeline = []

        for i in range(num_windows):
            chunk = data[i * window_size : (i + 1) * window_size]
            rms = np.sqrt(np.mean(chunk**2)) if len(chunk) > 0 else 0.0
            t_start = i * window_sec
            t_end = (i + 1) * window_sec
            energy_timeline.append({
                "time": round(t_start, 2),
                "end_time": round(t_end, 2),
                "rms": float(rms)
            })

        # Calculate mean & standard deviation to find peaks
        all_rms = [p["rms"] for p in energy_timeline]
        if all_rms:
            mean_rms = np.mean(all_rms)
            std_rms = np.std(all_rms)
            for p in energy_timeline:
                # Score 0 to 100 based on energy above mean
                z = (p["rms"] - mean_rms) / (std_rms + 1e-6)
                p["normalized_score"] = float(np.clip(50 + z * 20, 10, 100))
        
        return energy_timeline
    except Exception as e:
        print(f"Error analyzing audio energy: {e}")
        return []

def find_natural_audio_boundaries(audio_path: str, candidate_time: float, search_radius: float = 2.0) -> float:
    """Find the quietest moment near candidate_time to avoid cutting mid-word"""
    if not os.path.exists(audio_path):
        return candidate_time
    
    try:
        sample_rate, data = wavfile.read(audio_path)
        if len(data.shape) > 1:
            data = data.mean(axis=1)
        data = np.abs(data.astype(np.float32))

        start_sample = max(0, int((candidate_time - search_radius) * sample_rate))
        end_sample = min(len(data), int((candidate_time + search_radius) * sample_rate))
        
        window = int(0.1 * sample_rate) # 100ms
        min_energy = float('inf')
        best_sample = int(candidate_time * sample_rate)

        for s in range(start_sample, end_sample - window, window // 2):
            energy = np.mean(data[s : s + window])
            if energy < min_energy:
                min_energy = energy
                best_sample = s + window // 2

        return round(best_sample / sample_rate, 2)
    except Exception:
        return candidate_time
