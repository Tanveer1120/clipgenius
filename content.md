# CLIPGENIUS AI - COMPLETE PROJECT CONVERSATION & ARCHITECTURE RECORD

**Repository**: `https://github.com/Tanveer1120/clipgenius.git`  
**Brand**: CLIPGENIUS AI  
**Tagline**: *"Turn Every Video Into Viral Content."*  
**Date**: November 2026  

---

## 1. Project Objective & Core Concept

The goal of this project was to build a complete, professional, AI-powered automatic video clipping and editing application called **CLIPGENIUS AI**.

It is designed as a **100% free, local, open-source alternative** to commercial AI video clipping platforms such as:
- **OpusClip**
- **Vizard**
- **Submagic**

### Non-Negotiable Rules & Guarantees
1. **No Registration or Login**: Zero account creation or authentication barriers.
2. **No Subscriptions or Paywalls**: Completely free with unlimited exports.
3. **No Watermarks**: Finished videos are clean, professional, and ready for commercial publishing.
4. **No Mandatory Paid APIs**: All core speech recognition, vision tracking, audio analysis, and video processing run locally.
5. **Mandatory 9:16 Vertical Format**: Output resolution default is **1080×1920 Full HD** in H.264 + AAC MP4.
6. **No Video Stretching**: Maintain correct proportions via intelligent cropping, blurred background padding, or zooming.
7. **Real Processing**: FFmpeg rendering with real burnt-in subtitles, hook overlays, and audio mixing (not a static frontend prototype).

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 (JavaScript / JSX)
- **Tooling & Bundler**: Vite 8.3
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` integration)
- **Icons**: Lucide React
- **Animations**: Framer Motion & Canvas-Confetti
- **Theme**: Premium SaaS dark mode (charcoal/black backgrounds, purple and electric-blue gradients, subtle glowing borders).

### Backend
- **Framework**: Python 3.11 with FastAPI
- **Server**: Uvicorn (ASGI)
- **Data Validation**: Pydantic v2
- **Networking & Live Streaming**: WebSockets & Requests
- **URL Media Extraction**: `yt-dlp`

### Video & AI Processing
- **FFmpeg 9.1 & FFprobe**: Full build with H.264 (`libx264`), AAC, boxblur, libass subtitles, and filtergraph pipeline.
- **OpenCV (`opencv-python-headless`)**: Haar Cascade face detection and exponential moving average (EMA) subject tracking for vertical framing.
- **Faster-Whisper**: Local speech recognition for word-level synchronized transcriptions.
- **Scipy & NumPy**: Audio signal processing (short-time RMS energy variance, volume peaks, spectral flux, and natural pause detection).

---

## 3. Core System Features Implemented

### Feature 1: Three-in-One Video Input System
1. **File Upload (Option A)**:
   - Drag & drop or file browser.
   - Supports `MP4`, `MOV`, `MKV`, `AVI`, and `WEBM`.
   - Automatic thumbnail generation, duration detection, and file info.
2. **Paste Video URL (Option B)**:
   - Supports direct MP4 links, web video links, and public video sources via `yt-dlp`.
   - URL validation and clear fallback guidance.
3. **Live Stream Recording (Option C)**:
   - Real-time stream recording via FFmpeg with an active elapsed timer.
   - Stop and analyze workflow: automatically indexes and extracts highlights from recorded footage.

### Feature 2: Multi-Modal AI Viral Clipping Engine
- Scans audio energy peaks (loud moments, reactions, laughter, excitement).
- Analyzes speech pacing and dialog density.
- Identifies natural conversational pauses with `find_natural_audio_boundaries` to prevent mid-sentence cut-offs.
- Target durations: **15s, 30s, 45s, 60s, 90s**.
- Calculates an **Engagement Potential Score** (75%–99%) and generates a detailed reason explaining why each moment was selected.

### Feature 3: AI Opening Hook Generator
- Generates attention-grabbing opening lines across **12 categories**:
  *Curiosity, Shocking, Funny, Emotional, Suspense, Gaming, Storytelling, Mystery, Question, Unexpected, Motivational, Podcast.*
- Generates 5+ contextual hook suggestions per clip.
- Overlays the hook banner during the opening 3.5 seconds of each vertical short.

### Feature 4: Automatic Animated Caption Generator
- Generates Advanced SubStation Alpha (`.ass`) subtitle files with word-level synchronization.
- **15 Viral Caption Styles**:
  1. *Hormozi Style* (Bold uppercase, bright yellow active word highlight)
  2. *MrBeast Style* (High-energy comic yellow and neon green)
  3. *Gaming Style* (Futuristic cyber cyan & magenta glow)
  4. *Podcast Style* (Translucent dark badge subtitle)
  5. *Karaoke Style* (Progressive word bounce)
  6. *Minimal White* (Apple-style clean typography)
  7. *Neon Style* (Electric neon magenta and cyan)
  8. *Bold Yellow* (Classic high-CTR viral yellow)
  9. *Cinematic Style* (Serif gold letterboxed elegance)
  10. *Professional Style* (Modern corporate accent)
  11. *TikTok Style* (Rounded bold white on black pill)
  12. *Animated Word Highlight* (Active word pops in scale)
  13. *Rainbow Captions* (Dynamic multi-tone gradient)
  14. *Meme Captions* (Impact font with black border)
  15. *Clean Subtitle Style* (Crisp bottom subtitle bar)

### Feature 5: Automatic 9:16 Video Conversion
- Every short exports to **1080×1920 Full HD** (9:16 vertical).
- **Four Framing Modes**:
  1. **Blurred Background**: Scaled background with heavy Gaussian boxblur padding and crisp centered foreground.
  2. **AI Smart Crop**: OpenCV face detection with exponential moving average subject tracking to follow the speaker smoothly.
  3. **Zoom to Fill**: Expands video to fill the 9:16 canvas with zero black bars.
  4. **Podcast Split-Screen**: Stacked 2-camera vertical perspective.

### Feature 6: AI Video Editor Studio
- **4-Quadrant Workspace**:
  - *Left Toolbar*: Quick-switch between Templates, Captions, Hooks, Crop, and Audio.
  - *Center Canvas*: 9:16 vertical player with synchronized real-time subtitle overlays, animated hook banner, play/pause controls, and timecode scrubber.
  - *Right Property Controls*: Typography font selector, text color & highlight pickers, font size slider, vertical position slider, pan offset slider, and audio volume.
  - *Bottom Scrubber*: Video playback controls and clip bounds.

### Feature 7: Viral Template Marketplace
- 21 production presets across:
  - **Gaming**: GTA 6 Viral, GTA Cinematic, BGMI Highlights, PUBG Kill Moments, Minecraft Shorts, Gaming Reaction, Epic Gaming Moments.
  - **Podcast**: Modern Podcast, Hormozi Captions, Split Screen Podcast, Minimal Podcast, Cinematic Podcast.
  - **Entertainment**: Funny Moments, Meme Shorts, Reaction Videos, Unexpected Moments, Storytelling.
  - **Educational**: Facts Shorts, Motivational Videos, Knowledge Shorts, Explainer Videos.

### Feature 8: AI Title, Description & Hashtag Generator
- Generates 5 high-CTR titles per clip with single-click copy buttons.
- Formats ready-to-post SEO descriptions and viral hashtags for **YouTube Shorts**, **Instagram Reels**, and **TikTok**.

### Feature 9: Project Management & Settings
- Saves project state and clips locally in `LocalStorage`.
- Allows renaming, re-opening, deleting, and batch-downloading clips.
- System diagnostics for FFmpeg, Faster-Whisper, and OpenCV.

---

## 4. Full Integration Test Verification

The entire pipeline was tested end-to-end using `test_pipeline.py`:
- 1080p landscape test video (`1920x1080`, 30 FPS) analyzed.
- Audio stream extracted to 16kHz mono WAV.
- Waveform energy peaks detected and clipped into coherent viral segments.
- Contextual hooks and viral titles generated.
- Burn-in ASS subtitles and viral hook banners applied.
- Genuine **1080×1920 MP4** rendered using FFmpeg with H.264 + AAC.
- Verified output video file existence, 9:16 dimensions, audio sync, and zero watermark.

---

## 5. Repository File Structure

```
clipping/
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer
│   │   ├── pages/           # Home, CreateClips, Editor, Templates, Projects, Settings, About
│   │   ├── services/        # API client and WebSocket handlers
│   │   ├── App.jsx          # Top-level state & routing
│   │   └── index.css        # Tailwind v4 styles & glowing utilities
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── main.py              # FastAPI app & static file mounting
│   ├── routes/              # Video upload, clipping, export & template routes
│   ├── services/            # Video, Audio, Transcription, Highlight, Tracking & Render engines
│   ├── models/              # Pydantic schemas
│   └── requirements.txt
│
├── uploads/                 # Uploaded source videos & thumbnails
├── outputs/                 # Genuine rendered 1080p 9:16 vertical short MP4 files
├── temp/                    # Intermediate audio wavs, ASS subtitle files & cache
├── start_clipgenius.bat     # Windows one-click launcher
├── run_backend.py           # Backend startup script
├── content.md               # Complete project and conversation record
└── README.md                # Comprehensive documentation
```

---

## 6. How to Run

1. **One-Click Launch**: Double-click `start_clipgenius.bat`.
2. **Manual Launch**:
   - Backend: `python run_backend.py` -> `http://127.0.0.1:8000`
   - Frontend: `cd frontend && npm run dev` -> `http://localhost:5173`
