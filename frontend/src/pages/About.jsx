import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Code2, Heart, Download, Zap, Film } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Open Source Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About CLIPGENIUS AI
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          ClipGenius AI was engineered to democratize viral video editing. While commercial SaaS platforms charge $30–$60 per month for limited minutes and put watermarks on your hard work, ClipGenius AI provides a truly free, unlimited, local alternative.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800 space-y-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Zero Paywalls or Watermarks</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Every clip exported from ClipGenius AI is 100% watermark-free in crystal clear 1080p resolution. No subscriptions, credit cards, or accounts required.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800 space-y-2.5">
          <Cpu className="w-6 h-6 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Local AI Processing</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Speech transcription, highlight identification, face detection, and video rendering happen right on your machine. Your raw video footage never leaves your computer.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800 space-y-2.5">
          <Zap className="w-6 h-6 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Engineered For Virality</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our multi-modal engine combines acoustic energy peaks, speech velocity, scene dynamics, and opening curiosity hooks to maximize viewer retention on Shorts, Reels, and TikTok.
          </p>
        </div>
      </div>

      {/* Technology Stack Specifications */}
      <div className="p-8 rounded-2xl bg-[#0e101a] border border-gray-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-purple-400" />
          <span>Technology Stack Architecture</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#121422] border border-gray-800/80 space-y-1.5">
            <span className="font-bold text-purple-300">Frontend Presentation:</span>
            <p className="text-gray-400">React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Canvas-Confetti</p>
          </div>

          <div className="p-4 rounded-xl bg-[#121422] border border-gray-800/80 space-y-1.5">
            <span className="font-bold text-blue-300">Backend API Services:</span>
            <p className="text-gray-400">Python 3.11, FastAPI, Uvicorn, REST Endpoints, Asynchronous WebSockets</p>
          </div>

          <div className="p-4 rounded-xl bg-[#121422] border border-gray-800/80 space-y-1.5">
            <span className="font-bold text-cyan-300">Video Processing Engine:</span>
            <p className="text-gray-400">FFmpeg 9.1 (libx264, aac, boxblur, drawtext, ass filters), FFprobe, OpenCV</p>
          </div>

          <div className="p-4 rounded-xl bg-[#121422] border border-gray-800/80 space-y-1.5">
            <span className="font-bold text-emerald-300">AI & Audio Analysis:</span>
            <p className="text-gray-400">Faster-Whisper (word-level sync), Scipy RMS energy spectrum, OpenCV Haar Cascade face tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
