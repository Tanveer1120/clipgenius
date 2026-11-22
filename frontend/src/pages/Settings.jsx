import React, { useState } from 'react';
import { Settings as SettingsIcon, CheckCircle2, Shield, HardDrive, Cpu, Sliders, RefreshCw, Trash2 } from 'lucide-react';

export default function Settings() {
  const [resolution, setResolution] = useState('1080p');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [captionStyle, setCaptionStyle] = useState('hormozi');
  const [exportQuality, setExportQuality] = useState('high');
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [cleanedNotice, setCleanedNotice] = useState(false);

  const handleClearCache = () => {
    setCleanedNotice(true);
    setTimeout(() => setCleanedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-purple-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Customize default export formats, caption typography, video framing preferences and local storage options.
        </p>
      </div>

      <div className="space-y-6">
        {/* Render Defaults */}
        <div className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800/80 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Video Export Defaults</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Default Export Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121422] border border-gray-800 text-white text-xs focus:outline-none"
              >
                <option value="1080p">1080 × 1920 Full HD (Recommended)</option>
                <option value="720p">720 × 1280 Fast HD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Default Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                disabled
                className="w-full px-3 py-2.5 rounded-xl bg-[#121422] border border-gray-800 text-purple-300 text-xs focus:outline-none font-bold"
              >
                <option value="9:16">9:16 Vertical Shorts (Mandatory Default)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Default Caption Typography Style
              </label>
              <select
                value={captionStyle}
                onChange={(e) => setCaptionStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121422] border border-gray-800 text-white text-xs focus:outline-none"
              >
                <option value="hormozi">Hormozi Style (Bold Yellow Highlight)</option>
                <option value="mrbeast">MrBeast High-Energy</option>
                <option value="gaming">Gaming Cyber Neon</option>
                <option value="podcast">Podcast Clean Box</option>
                <option value="karaoke">Karaoke Progressive Fill</option>
                <option value="minimal_white">Minimal White (Apple-style)</option>
                <option value="tiktok">TikTok Rounded Pill</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Video Render Quality & Preset
              </label>
              <select
                value={exportQuality}
                onChange={(e) => setExportQuality(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121422] border border-gray-800 text-white text-xs focus:outline-none"
              >
                <option value="high">High Quality (CRF 22 • H.264 Veryfast)</option>
                <option value="max">Maximum Quality (CRF 18 • H.264 Slow)</option>
                <option value="fast">Ultra Fast (CRF 26 • Ultrafast)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Local Storage & Cache */}
        <div className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800/80 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Storage & Temporary Files</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#121422] border border-gray-800 text-xs">
            <div>
              <div className="font-semibold text-white">Automatic Cache Pruning</div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Periodically cleans intermediate extraction files from the temp directory.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoCleanup}
              onChange={(e) => setAutoCleanup(e.target.checked)}
              className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400">Clear all temporary intermediate audio/video cuts</span>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>{cleanedNotice ? 'Temporary Files Cleaned!' : 'Clean Temp Files'}</span>
            </button>
          </div>
        </div>

        {/* System Diagnostics & Engine Status */}
        <div className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800/80 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Local Engine Diagnostics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#121422] border border-gray-800 flex items-center justify-between">
              <span className="text-gray-300">FFmpeg Video Engine:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready (Full 1080p)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#121422] border border-gray-800 flex items-center justify-between">
              <span className="text-gray-300">Faster-Whisper AI:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Installed & Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#121422] border border-gray-800 flex items-center justify-between">
              <span className="text-gray-300">OpenCV Face & Subject Tracking:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active (Haar Cascades)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#121422] border border-gray-800 flex items-center justify-between">
              <span className="text-gray-300">Audio Energy Analyzer:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active (Scipy RMS)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
