import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  Sliders, 
  Type, 
  Layers, 
  Music, 
  Smartphone, 
  Check, 
  Copy, 
  RefreshCw,
  Crop,
  Maximize2,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { renderClip } from '../services/api';
import confetti from 'canvas-confetti';

const FONT_OPTIONS = ['Montserrat', 'Impact', 'Arial Black', 'Georgia', 'Segoe UI', 'Roboto'];

export default function Editor({ 
  currentClip, 
  videoData, 
  onBackToClips,
  templates = []
}) {
  // If no clip provided, use a default fallback structure
  const [clip, setClip] = useState(currentClip || {
    id: 'demo_clip',
    video_id: videoData?.video_id || 'sample',
    start_time: 0.0,
    end_time: 30.0,
    duration: 30.0,
    title: 'This Insane Viral Moment Left Everyone Speechless!',
    hook: 'Wait until you see what happens next...',
    highlight_category: 'Gaming Highlights',
    crop_mode: 'blurred_bg',
    captions: [
      { start: 0.5, end: 3.5, text: "WAIT UNTIL YOU SEE THIS INCREDIBLE MOMENT" },
      { start: 4.0, end: 7.5, text: "NOBODY EXPECTED THIS TO HAPPEN LIVE ON STREAM" },
      { start: 8.0, end: 12.0, text: "THIS COMPLETELY CHANGED THE ENTIRE OUTCOME" },
      { start: 12.5, end: 16.0, text: "WATCH CAREFULLY RIGHT AT THIS SECOND" },
      { start: 16.5, end: 20.0, text: "THE ENDING IS ABSOLUTELY UNBELIEVABLE" }
    ]
  });

  // Editor Left Nav Tab
  const [leftTab, setLeftTab] = useState('captions'); // 'templates', 'captions', 'hooks', 'crop', 'audio'

  // Video Player State
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(clip.duration || 30.0);
  const [isMuted, setIsMuted] = useState(false);

  // Editing Properties State
  const [captionStyle, setCaptionStyle] = useState('hormozi');
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [highlightColor, setHighlightColor] = useState('#FFE600');
  const [captionFontSize, setCaptionFontSize] = useState(24);
  const [captionPositionY, setCaptionPositionY] = useState(75); // percent
  const [hookText, setHookText] = useState(clip.hook || '');
  const [cropMode, setCropMode] = useState(clip.crop_mode || 'blurred_bg');
  const [manualCropX, setManualCropX] = useState(0.5);
  const [audioVolume, setAudioVolume] = useState(1.0);
  const [bgMusic, setBgMusic] = useState('none');
  const [soundEffect, setSoundEffect] = useState('whoosh');

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState(null);
  const [exportedFilename, setExportedFilename] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState('1080p');

  // Sync Video with Trimming Bounds
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    // If reached end of trimmed clip, loop back to start
    if (t >= (clip.end_time || 30.0)) {
      videoRef.current.currentTime = clip.start_time || 0.0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Find active caption segment for the current time
  const relTime = currentTime - (clip.start_time || 0.0);
  const activeCaption = clip.captions?.find(c => relTime >= c.start && relTime <= c.end);
  const showHookBanner = relTime >= 0 && relTime <= 3.5 && hookText.trim().length > 0;

  // Handle Export Rendering
  const handleRenderExport = async () => {
    setIsExporting(true);
    setExportProgress(15);
    setExportedVideoUrl(null);

    const progressTimer = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 15;
      });
    }, 1200);

    try {
      const res = await renderClip({
        clip_id: clip.id,
        video_id: clip.video_id,
        start_time: clip.start_time,
        end_time: clip.end_time,
        resolution: selectedResolution,
        crop_mode: cropMode,
        manual_crop_x: manualCropX,
        caption_style: captionStyle,
        caption_font: fontFamily,
        caption_color: primaryColor,
        caption_highlight_color: highlightColor,
        caption_position_y: captionPositionY,
        caption_font_size: captionFontSize * 2, // scale for 1080p canvas
        hook_text: hookText,
        hook_duration: 3.5,
        audio_volume: audioVolume,
        bg_music: bgMusic === 'none' ? null : bgMusic
      });

      clearInterval(progressTimer);
      setExportProgress(100);
      setExportedVideoUrl(res.url);
      setExportedFilename(res.output_filename);

      // Launch victory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Trigger automatic file download
      const downloadLink = document.createElement('a');
      downloadLink.href = `/api/export/download/${res.output_filename}`;
      downloadLink.setAttribute('download', res.output_filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

    } catch (err) {
      clearInterval(progressTimer);
      alert(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Apply a template preset
  const applyTemplatePreset = (tpl) => {
    if (!tpl) return;
    setCaptionStyle(tpl.caption_style || 'hormozi');
    setFontFamily(tpl.font || 'Montserrat');
    setPrimaryColor(tpl.primary_color || '#FFFFFF');
    setHighlightColor(tpl.accent_color || '#FFE600');
    setCropMode(tpl.crop_mode || 'blurred_bg');
    if (tpl.sound_effect) setSoundEffect(tpl.sound_effect);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#07080c] overflow-hidden text-gray-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#0b0c14] shrink-0">
        <div className="flex items-center gap-4">
          {onBackToClips && (
            <button
              onClick={onBackToClips}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clips</span>
            </button>
          )}

          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 truncate max-w-md">
              <span>{clip.title}</span>
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="text-purple-400 font-semibold">{clip.highlight_category}</span>
              <span>•</span>
              <span>{clip.duration}s</span>
              <span>•</span>
              <span>9:16 Vertical Preview</span>
            </div>
          </div>
        </div>

        {/* Resolution selector & Export CTA */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-gray-900 p-1 border border-gray-800 text-xs font-semibold">
            <button
              onClick={() => setSelectedResolution('1080p')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedResolution === '1080p' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              1080p (FHD)
            </button>
            <button
              onClick={() => setSelectedResolution('720p')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedResolution === '720p' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              720p
            </button>
          </div>

          <button
            onClick={handleRenderExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Rendering {exportProgress}%</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export 1080p Free</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT TOOLBAR TABS */}
        <div className="w-16 bg-[#090a10] border-r border-gray-800/80 flex flex-col items-center py-4 gap-4 shrink-0">
          {[
            { id: 'templates', icon: Layers, label: 'Templates' },
            { id: 'captions', icon: Type, label: 'Captions' },
            { id: 'hooks', icon: Sparkles, label: 'Hooks' },
            { id: 'crop', icon: Crop, label: 'Crop' },
            { id: 'audio', icon: Music, label: 'Audio' }
          ].map(tool => {
            const Icon = tool.icon;
            const isActive = leftTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setLeftTab(tool.id)}
                title={tool.label}
                className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-semibold mt-0.5">{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* LEFT TOOL OPTIONS DRAWER */}
        <div className="w-72 bg-[#0d0f18] border-r border-gray-800/80 p-5 overflow-y-auto shrink-0 space-y-6">
          {/* TEMPLATES TAB */}
          {leftTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Preset Templates</h3>
              <div className="space-y-2.5">
                {templates.slice(0, 10).map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => applyTemplatePreset(tpl)}
                    className="p-3 rounded-xl bg-[#121422] hover:bg-[#181b2e] border border-gray-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{tpl.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {tpl.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{tpl.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CAPTIONS TAB */}
          {leftTab === 'captions' && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Caption Styles (15)</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hormozi', name: 'Hormozi', preview: 'BOLD YELLOW' },
                  { id: 'mrbeast', name: 'MrBeast', preview: 'PUNCHY' },
                  { id: 'gaming', name: 'Gaming Cyber', preview: 'NEON' },
                  { id: 'podcast', name: 'Podcast', preview: 'CLEAN BOX' },
                  { id: 'karaoke', name: 'Karaoke', preview: 'BOUNCE' },
                  { id: 'minimal_white', name: 'Minimal White', preview: 'APPLE' },
                  { id: 'neon', name: 'Neon Glow', preview: 'GLOW' },
                  { id: 'bold_yellow', name: 'Bold Yellow', preview: 'VIRAL' },
                  { id: 'cinematic', name: 'Cinematic', preview: 'SERIF' },
                  { id: 'tiktok', name: 'TikTok', preview: 'PILL' },
                  { id: 'animated_highlight', name: 'Animated Word', preview: 'POP' },
                  { id: 'rainbow', name: 'Rainbow', preview: 'MULTI' },
                  { id: 'meme', name: 'Meme', preview: 'IMPACT' },
                  { id: 'clean_subtitle', name: 'Clean Sub', preview: 'SUBTITLE' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setCaptionStyle(style.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      captionStyle === style.id
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow'
                        : 'bg-[#121422] border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{style.name}</div>
                    <div className="text-[9px] text-purple-300 font-mono mt-0.5">{style.preview}</div>
                  </button>
                ))}
              </div>

              {/* Editable Transcript Segments */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <span className="text-xs font-semibold text-gray-300">Editable Transcript Segments</span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {clip.captions?.map((cap, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#121422] border border-gray-800 space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>{cap.start}s - {cap.end}s</span>
                      </div>
                      <input
                        type="text"
                        value={cap.text}
                        onChange={(e) => {
                          const updated = [...clip.captions];
                          updated[i].text = e.target.value;
                          setClip({ ...clip, captions: updated });
                        }}
                        className="w-full bg-transparent text-xs text-white focus:outline-none focus:border-b border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HOOKS TAB */}
          {leftTab === 'hooks' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Opening Hook Generator</h3>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Current Intro Hook Text
                </label>
                <textarea
                  rows="3"
                  value={hookText}
                  onChange={(e) => setHookText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121422] border border-gray-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Enter hook line shown in first 3.5 seconds..."
                />
              </div>

              {/* Hook Suggestions */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-gray-300">Suggested AI Hooks:</span>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {(clip.hooks_pool || []).map((h, i) => (
                    <div
                      key={i}
                      onClick={() => setHookText(h.text)}
                      className="p-2.5 rounded-xl bg-[#121422] hover:bg-[#181b2e] border border-gray-800 hover:border-purple-500/40 cursor-pointer text-xs transition-colors"
                    >
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold mb-1 inline-block">
                        {h.category}
                      </span>
                      <p className="text-gray-200 italic">"{h.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CROP TAB */}
          {leftTab === 'crop' && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">9:16 Vertical Framing</h3>
              
              <div className="space-y-2">
                {[
                  { id: 'blurred_bg', title: 'Blurred Background', desc: 'Preserves full video framing with high-end blurred border padding.' },
                  { id: 'smart_crop', title: 'AI Smart Crop', desc: 'Focuses and smoothly follows detected subject faces.' },
                  { id: 'zoom_fill', title: 'Zoom to Fill', desc: 'Fills entire 9:16 vertical canvas without borders.' },
                  { id: 'split_screen', title: 'Podcast Split Screen', desc: 'Stacked 2-camera vertical perspective.' }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setCropMode(opt.id)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      cropMode === opt.id
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-[#121422] border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.title}</div>
                    <div className="text-[10px] text-gray-400 mt-1 leading-relaxed">{opt.desc}</div>
                  </div>
                ))}
              </div>

              {/* Manual Pan Adjustment */}
              {cropMode === 'smart_crop' && (
                <div className="pt-2 border-t border-gray-800 space-y-2">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Manual Horizontal Pan:</span>
                    <span className="text-purple-400 font-mono">{Math.round(manualCropX * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={manualCropX}
                    onChange={(e) => setManualCropX(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AUDIO TAB */}
          {leftTab === 'audio' && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Audio Enhancement</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Video Volume:</span>
                  <span className="text-purple-400 font-mono">{Math.round(audioVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Opening Sound Effect
                </label>
                <select
                  value={soundEffect}
                  onChange={(e) => setSoundEffect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121422] border border-gray-800 text-xs text-white focus:outline-none"
                >
                  <option value="whoosh">Fast Cinematic Whoosh</option>
                  <option value="pop">Punchy Pop Sound</option>
                  <option value="ding">Insightful Bell Ding</option>
                  <option value="cinematic_hit">Dramatic Cinematic Hit</option>
                  <option value="none">None (Original Only)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* CENTER VIDEO WORKSPACE CANVAS */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#08090d] relative overflow-hidden">
          {/* Vertical 9:16 Preview Container */}
          <div className="relative h-[480px] sm:h-[540px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800/80 group">
            
            {/* Blurred background layer if mode is blurred_bg */}
            {cropMode === 'blurred_bg' && (
              <video
                src={videoData?.url || clip.preview_url}
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-60 scale-125 pointer-events-none"
                muted
              />
            )}

            {/* Foreground video */}
            <video
              ref={videoRef}
              src={videoData?.url || clip.preview_url}
              onTimeUpdate={handleTimeUpdate}
              className={`relative z-10 w-full h-full ${
                cropMode === 'zoom_fill' ? 'object-cover' : 'object-contain'
              }`}
              muted={isMuted}
              playsInline
            />

            {/* LIVE HOOK BANNER OVERLAY */}
            {showHookBanner && (
              <div 
                className="absolute z-20 top-12 left-4 right-4 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-yellow-500/40 text-center animate-bounce shadow-xl"
                style={{ animationDuration: '2s' }}
              >
                <span className="text-[10px] uppercase font-bold text-yellow-400 block tracking-wider">
                  VIRAL HOOK
                </span>
                <p className="text-xs font-black text-white leading-tight">
                  {hookText}
                </p>
              </div>
            )}

            {/* LIVE SYNCHRONIZED CAPTION OVERLAY */}
            {activeCaption && (
              <div
                className="absolute z-20 left-4 right-4 text-center pointer-events-none transition-all duration-150"
                style={{ top: `${captionPositionY}%` }}
              >
                <span
                  style={{
                    fontFamily: fontFamily,
                    fontSize: `${captionFontSize}px`,
                    color: primaryColor,
                    textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
                    WebkitTextStroke: '1px black',
                    fontWeight: '900',
                    lineHeight: '1.2'
                  }}
                  className="inline-block px-3 py-1 uppercase tracking-wide drop-shadow-xl"
                >
                  {activeCaption.text}
                </span>
              </div>
            )}

            {/* Hover overlay play button */}
            <div 
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </div>
            </div>

            {/* Aspect ratio badge */}
            <span className="absolute z-20 top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white border border-white/10">
              9:16 VERTICAL
            </span>
          </div>

          {/* Playback Controls Scrubber Bar */}
          <div className="w-full max-w-md mt-4 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0f111c] border border-gray-800 shadow-md">
            <button
              onClick={togglePlay}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <span className="text-[11px] font-mono text-gray-400 min-w-[3rem]">
              {currentTime.toFixed(1)}s
            </span>

            <input
              type="range"
              min={clip.start_time || 0}
              max={clip.end_time || 30}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />

            <span className="text-[11px] font-mono text-gray-400 min-w-[3rem]">
              {(clip.end_time || 30).toFixed(1)}s
            </span>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* RIGHT PROPERTY CONTROLS */}
        <div className="w-72 bg-[#0d0f18] border-l border-gray-800/80 p-5 overflow-y-auto shrink-0 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Visual Styling</h3>

          {/* Font Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Typography Font
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121422] border border-gray-800 text-xs text-white focus:outline-none"
            >
              {FONT_OPTIONS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#121422] border border-gray-800">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[10px] font-mono text-gray-300">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Highlight Color
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#121422] border border-gray-800">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-[10px] font-mono text-gray-300">{highlightColor}</span>
              </div>
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Font Size:</span>
              <span className="text-purple-400 font-mono">{captionFontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="36"
              value={captionFontSize}
              onChange={(e) => setCaptionFontSize(parseInt(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Position Y Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Vertical Position:</span>
              <span className="text-purple-400 font-mono">{captionPositionY}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={captionPositionY}
              onChange={(e) => setCaptionPositionY(parseInt(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Top</span>
              <span>Center</span>
              <span>Bottom</span>
            </div>
          </div>

          {/* Export Box */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3 pt-3">
            <span className="text-xs font-bold text-white block">Ready to Export?</span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Renders genuine 1080×1920 Full HD vertical video with burnt-in animated captions, opening hook, and audio mix.
            </p>
            <button
              onClick={handleRenderExport}
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 1080p MP4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
