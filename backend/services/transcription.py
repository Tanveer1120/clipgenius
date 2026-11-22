import os
from typing import List, Dict, Any, Optional

_whisper_model = None

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            # 'tiny' or 'base' for fast local CPU inference
            _whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
        except Exception as e:
            print(f"Faster-whisper model load notice: {e}")
            _whisper_model = False
    return _whisper_model

def transcribe_audio(audio_path: str, language: Optional[str] = None) -> List[Dict[str, Any]]:
    if not os.path.exists(audio_path):
        return []

    model = get_whisper_model()
    if model:
        try:
            segments, info = model.transcribe(
                audio_path,
                beam_size=2,
                word_timestamps=True,
                language=language
            )
            results = []
            for s in segments:
                words = []
                if hasattr(s, "words") and s.words:
                    for w in s.words:
                        words.append({
                            "word": w.word.strip(),
                            "start": round(w.start, 2),
                            "end": round(w.end, 2),
                            "probability": round(w.probability, 2)
                        })
                results.append({
                    "start": round(s.start, 2),
                    "end": round(s.end, 2),
                    "text": s.text.strip(),
                    "words": words,
                    "highlight": False
                })
            if results:
                return results
        except Exception as e:
            print(f"Transcription error: {e}")

    # Fallback speech transcription generator for testing / offline situations
    # Creates believable speech pacing matching audio length
    return []
