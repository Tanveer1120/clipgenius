# CLIPGENIUS AI 🎬⚡
### *"Turn Every Video Into Viral Content."*

An AI-powered, completely free and open-source automatic video clipping and editing platform. Built as a local alternative to commercial paid platforms such as **OpusClip**, **Vizard**, and **Submagic**.

Transform raw gameplay, podcasts, interviews, lectures, and live streams into engaging, viral-ready vertical 9:16 short videos with opening hooks, animated captions, and professional effects.

---

## 🌟 Core Highlights & The Free Guarantee

- 🚫 **No Registration or Login Required**
- 🚫 **No Subscriptions or Credit Cards**
- 🚫 **No Watermarks on Exported Videos**
- 🚫 **No Mandatory Paid APIs**
- 💻 **100% Local Video & Audio Processing**
- 📱 **Mandatory 1080×1920 (9:16) Full HD Output**
- ⚡ **Real FFmpeg Video Rendering** (Not a frontend mockup)

---

## 🚀 Key Features

### 1. Three Video Input Methods
- **File Upload**: Drag-and-drop support for `MP4`, `MOV`, `MKV`, `AVI`, and `WEBM` files. Complete with thumbnail generation, duration calculation, and file metadata detection.
- **Paste Video URL**: Direct URL import for public video links (direct MP4 files, web links, and supported extraction sources via `yt-dlp`).
- **Live Stream Recording**: Record live stream feeds in real-time with an active elapsed timer. Automatically stops, indexes, and extracts high-energy highlights from the recorded footage.

### 2. AI Viral Clipping Engine
- **Multi-Modal Content Analysis**: Combines audio energy variance, volume peaks, spectral flux, speech velocity, and visual dynamism.
- **Natural Boundary Snapping**: Clips start and end on natural conversational pauses and acoustic breaks to avoid cutting speakers mid-sentence.
- **Custom Target Durations**: Choose 15s, 30s, 45s, 60s, or 90s target clip lengths.
- **Viral Potential Score**: Each clip receives a calculated virality rating (75%–99%) and an explanation of why the moment was selected.

### 3. AI Hook Generator
- Generates attention-grabbing opening lines across **12 categories**:
  *Curiosity, Shocking, Funny, Emotional, Suspense, Gaming, Storytelling, Mystery, Question, Unexpected, Motivational, Podcast.*
- Displays at least 5 contextual hook suggestions per clip.
- Overlays the hook banner during the first 3.5 seconds of each vertical short to maximize 3-second viewer retention.

### 4. Automatic Animated Caption Generator
- Word-level timestamps and synchronized subtitle animation.
- **15 Viral Caption Typography Styles**:
  1. *Hormozi Style* (Bold uppercase, bright yellow active word highlight)
  2. *MrBeast Style* (High-energy comic yellow and neon green)
  3. *Gaming Style* (Futuristic cyber cyan & magenta glow)
  4. *Podcast Style* (Translucent dark badge subtitle)
  5. *Karaoke Style* (Word-by-word progressive color bounce)
  6. *Minimal White* (Apple-style clean typography)
  7. *Neon Style* (Electric magenta and cyan glow)
  8. *Bold Yellow* (Classic high-CTR viral yellow)
  9. *Cinematic Style* (Serif gold letterboxed elegance)
  10. *Professional Style* (Modern corporate accent)
  11. *TikTok Style* (Rounded bold white on black pill)
  12. *Animated Word Highlight* (Active word pops in scale)
  13. *Rainbow Captions* (Dynamic multi-tone gradient)
  14. *Meme Captions* (Impact font with black border)
  15. *Clean Subtitle Style* (Crisp bottom subtitle bar)

### 5. Automatic 9:16 Video Conversion
- Every generated clip is formatted to vertical 9:16 (**1080×1920**).
- **Four Smart Framing Modes**:
  - **Blurred Background**: Scaled background with heavy Gaussian boxblur padding and crisp centered foreground.
  - **AI Smart Crop**: OpenCV face detection and exponential moving average subject tracking to keep the speaker centered without camera jitter.
  - **Zoom to Fill**: Expands video to fill the vertical frame with no black bars.
  - **Podcast Split-Screen**: Stacked 2-pane vertical perspective for host and guest.

### 6. AI Video Editor Studio
- **4-Quadrant Layout**:
  - *Left Toolbar*: Templates, Captions, Hooks, Crop, Audio.
  - *Center Canvas*: Vertical 9:16 live video preview with synchronized subtitles and hook banners.
  - *Right Property Controls*: Font selector, primary & highlight color pickers, font size slider, vertical position slider, volume control.
  - *Bottom Scrubber*: Video playback controls, timecode scrubber, and loop mode.

### 7. Viral Template Marketplace
- 21 production-grade presets across **Gaming** (*GTA 6 Viral, BGMI Highlights, PUBG Kill Moments, Minecraft Shorts*), **Podcast** (*Modern Podcast, Split Screen*), **Entertainment** (*Funny Moments, Meme Shorts*), and **Educational** (*Facts Shorts, Motivational Videos*).

### 8. AI Title, Description & Hashtag Generator
- Generates 5 high-CTR titles per clip.
- Generates SEO descriptions and viral hashtags for **YouTube Shorts**, **Instagram Reels**, and **TikTok**.

---

## 🛠 Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Canvas-Confetti
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic, REST API, WebSockets
- **Video Engine**: FFmpeg 9.1 (`libx264`, `aac`, `boxblur`, `ass`), FFprobe, OpenCV Headless
- **AI & Audio**: Faster-Whisper, Scipy WAV audio frequency & RMS energy analyzer, Haar Cascade face tracking

---

## 💻 System Requirements

- **Operating System**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 8 GB (16 GB recommended for 4K video rendering)
- **CPU**: Multi-core Intel/AMD x64 or Apple Silicon
- **Disk Space**: ~2 GB for FFmpeg, Python packages, and models

---

## 📦 Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js 18+** and **Python 3.10+** installed:
```powershell
node --version
python --version
```

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/clipgenius-ai.git
cd clipgenius-ai
```

### 3. Backend Setup
Install Python dependencies:
```powershell
pip install -r backend/requirements.txt
```

### 4. FFmpeg Setup
FFmpeg binaries are bundled directly in the project root (`ffmpeg.exe` and `ffprobe.exe`). If installing on a fresh system, ensure FFmpeg is on your system `PATH`:
```powershell
winget install Gyan.FFmpeg
```

### 5. Frontend Setup
```powershell
cd frontend
npm install
cd ..
```

---

## 🏃 Running the Application

### Option A: One-Click Launch (Windows)
Double-click `start_clipgenius.bat` in the root folder. It will start both backend and frontend servers automatically!

### Option B: Manual Launch

#### Terminal 1 — Start Backend Server:
```powershell
python run_backend.py
```
*The FastAPI backend will start at `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).*

#### Terminal 2 — Start Frontend Server:
```powershell
cd frontend
npm run dev
```
*The React UI will start at `http://localhost:5173`.*

Open `http://localhost:5173` in your browser.

---

## 📂 Project Directory Structure

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
└── README.md
```

---

## 🛡 Privacy & Local Processing Guarantee

- **No Data Leaves Your Computer**: All transcription, computer vision processing, and video rendering happen entirely on your local CPU/GPU.
- **No Account Necessary**: Everything is saved to your browser's `LocalStorage` and local project folders.
- **No Watermarks**: Finished videos are clean, professional, and ready for commercial publishing.
