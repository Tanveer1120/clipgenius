import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Radio, 
  Sparkles, 
  Clock, 
  Scissors, 
  Film, 
  Layers, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  Sliders, 
  Download, 
  Play, 
  Pause,
  Trash2,
  Share2,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  uploadVideo, 
  importVideoUrl, 
  startStreamRecord, 
  getStreamStatus, 
  stopStreamRecord, 
  generateViralClips,
  regenerateTitles,
  regenerateHooks,
  renderClip,
  getTemplates
} from '../services/api';

export default function CreateClips({ 
  initialMode = 'upload', 
  onOpenEditor, 
  onSaveToProject,
  templates = []
}) {
  const [activeTab, setActiveTab] = useState(initialMode); // 'upload', 'url', 'stream'
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // URL Input State
  const [urlInput, setUrlInput] = useState('');

  // Live Stream State
  const [streamUrl, setStreamUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingId, setRecordingId] = useState(null);
  const [recordingElapsed, setRecordingElapsed] = useState(0);

  // Clipping Configuration
  const [targetDuration, setTargetDuration] = useState(30); // 15, 30, 45, 60, 90
  const [maxClips, setMaxClips] = useState(5);
  const [cropMode, setCropMode] = useState('blurred_bg'); // 'smart_crop', 'blurred_bg', 'zoom_fill', 'split_screen'
  const [selectedTemplate, setSelectedTemplate] = useState('hormozi_captions');

  // Generated Clips State
  const [generatedClips, setGeneratedClips] = useState([]);
  const [isRenderingClipId, setIsRenderingClipId] = useState(null);
  const [copyStatus, setCopyStatus] = useState({});

  // Stream polling timer
  useEffect(() => {
    let interval;
    if (isRecording && recordingId) {
      interval = setInterval(async () => {
        try {
          const status = await getStreamStatus(recordingId);
          setRecordingElapsed(status.elapsed_seconds || 0);
          if (status.completed && status.video_metadata) {
            setIsRecording(false);
            setVideoData(status.video_metadata);
            clearInterval(interval);
          } else if (status.status === 'failed') {
            setIsRecording(false);
            setErrorMessage(status.error || 'Stream recording failed');
            clearInterval(interval);
          }
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingId]);

  // Handle Local File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsLoading(true);
    setLoadingStep('Uploading video and analyzing audio streams...');

    try {
      const data = await uploadVideo(file);
      setVideoData(data);
      setGeneratedClips([]);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to upload video');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handle URL Import
  const handleUrlSubmit = async (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;

    setErrorMessage('');
    setIsLoading(true);
    setLoadingStep('Extracting video from URL and probing media streams...');

    try {
      const data = await importVideoUrl(urlInput.trim());
      setVideoData(data);
      setGeneratedClips([]);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to import video link');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handle Live Stream Start
  const handleStartStream = async () => {
    const targetUrl = streamUrl.trim() || 'demo';
    setErrorMessage('');
    setIsLoading(true);
    setLoadingStep('Connecting to live stream feed...');

    try {
      const res = await startStreamRecord(targetUrl, 25);
      setRecordingId(res.record_id);
      setIsRecording(true);
      setRecordingElapsed(0);
    } catch (err) {
      setErrorMessage(err.message || 'Could not connect to live stream');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Handle Live Stream Stop
  const handleStopStream = async () => {
    if (!recordingId) return;
    setIsLoading(true);
    setLoadingStep('Finalizing stream recording and indexing footage...');
    try {
      const res = await stopStreamRecord(recordingId);
      if (res.video_metadata) {
        setVideoData(res.video_metadata);
        setIsRecording(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error stopping stream');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Generate Viral Clips
  const handleGenerateClips = async () => {
    if (!videoData) return;

    setErrorMessage('');
    setIsLoading(true);
    setLoadingStep('AI Multi-modal Engine: Analyzing audio energy peaks, speech pacing & exciting moments...');

    try {
      const clips = await generateViralClips({
        video_id: videoData.video_id,
        target_duration: targetDuration,
        max_clips: maxClips,
        crop_mode: cropMode,
        template_id: selectedTemplate
      });

      setGeneratedClips(clips);
      if (onSaveToProject) {
        onSaveToProject(videoData, clips);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to generate viral clips');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Quick Export Clip 1080p
  const handleQuickExport = async (clip) => {
    setIsRenderingClipId(clip.id);
    try {
      const res = await renderClip({
        clip_id: clip.id,
        video_id: clip.video_id,
        start_time: clip.start_time,
        end_time: clip.end_time,
        resolution: '1080p',
        crop_mode: clip.crop_mode || cropMode,
        manual_crop_x: 0.5,
        caption_style: 'hormozi',
        hook_text: clip.hook,
        hook_duration: 3.5,
        audio_volume: 1.0
      });

      // Trigger actual download in browser
      const downloadLink = document.createElement('a');
      downloadLink.href = `/api/export/download/${res.output_filename}`;
      downloadLink.setAttribute('download', res.output_filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Update clip rendered_url
      setGeneratedClips(prev => prev.map(c => c.id === clip.id ? { ...c, rendered_url: res.url, rendered_1080p: res.url } : c));
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setIsRenderingClipId(null);
    }
  };

  // Regenerate Titles for a Clip
  const handleRegenerateTitles = async (clipId, category) => {
    try {
      const res = await regenerateTitles(category);
      if (res.titles && res.titles.length > 0) {
        setGeneratedClips(prev => prev.map(c => {
          if (c.id === clipId) {
            return {
              ...c,
              title: res.titles[0],
              titles_pool: res.titles
            };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Regenerate Hooks for a Clip
  const handleRegenerateHooks = async (clipId, category) => {
    try {
      const res = await regenerateHooks(category);
      if (res.hooks && res.hooks.length > 0) {
        setGeneratedClips(prev => prev.map(c => {
          if (c.id === clipId) {
            return {
              ...c,
              hook: res.hooks[0].text,
              hooks_pool: res.hooks
            };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-purple-400" />
          <span>AI Viral Clipping Engine</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload video files, paste public URLs, or record live streams. Our AI finds the most exciting moments and converts them into viral 9:16 vertical shorts.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">Notice: </span>
            {errorMessage}
          </div>
          <button 
            onClick={() => setErrorMessage('')}
            className="text-gray-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading Progress State */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-[#0f111e] border border-purple-500/40 shadow-xl shadow-purple-500/10 text-center space-y-4">
          <div className="inline-block relative">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
            <Sparkles className="w-6 h-6 text-purple-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Processing Video with AI</h3>
            <p className="text-xs text-purple-300 animate-pulse">{loadingStep}</p>
          </div>
          <div className="max-w-md mx-auto h-2 rounded-full bg-gray-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 animate-pulse-glow w-3/4"></div>
          </div>
        </div>
      )}

      {/* Input Options Card */}
      {!videoData && !isLoading && (
        <div className="rounded-2xl bg-[#0d0f18] border border-gray-800/80 p-6 sm:p-8 space-y-6">
          {/* Tab Selector */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>A. Upload Video File</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'url' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>B. Paste Video URL</span>
            </button>

            <button
              onClick={() => setActiveTab('stream')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'stream' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>C. Live Stream</span>
            </button>
          </div>

          {/* TAB A: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label 
                htmlFor="video-file-input"
                className="group flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-2xl bg-[#0a0b12] hover:bg-[#111320] transition-all cursor-pointer text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-600/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Drag and drop your video here, or <span className="text-purple-400 underline">browse</span>
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mb-4">
                  Supports MP4, MOV, MKV, AVI, and WEBM. Any aspect ratio (16:9, 4:3, square). Automatically converted to 9:16.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>Up to 4K resolution</span>
                  <span>•</span>
                  <span>Free local processing</span>
                  <span>•</span>
                  <span>No duration lock</span>
                </div>
                <input 
                  id="video-file-input"
                  type="file" 
                  accept=".mp4,.mov,.mkv,.avi,.webm"
                  onChange={handleFileUpload}
                  className="hidden" 
                />
              </label>
            </div>
          )}

          {/* TAB B: PASTE URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Enter Public Video Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or direct .mp4 link"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0a0b12] border border-gray-700 focus:border-blue-500 focus:outline-none text-white text-xs"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Extract</span>
                  </button>
                </div>
              </div>

              {/* Sample link buttons for quick demonstration */}
              <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
                <span>Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => setUrlInput('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                  className="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]"
                >
                  Direct MP4 Sample (1080p)
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4')}
                  className="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]"
                >
                  Animation Sample
                </button>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-800/60 pt-3">
                * Note: Extracting content respects platform restrictions and terms of service. If automated extraction is disabled by a platform, you can simply upload the video file directly.
              </p>
            </form>
          )}

          {/* TAB C: LIVE STREAM */}
          {activeTab === 'stream' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Live Stream URL (HLS / RTMP / Web Stream)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter live stream URL or type 'demo' to test stream recorder"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0a0b12] border border-gray-700 focus:border-red-500 focus:outline-none text-white text-xs"
                  />
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartStream}
                      className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 whitespace-nowrap"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopStream}
                      className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20 whitespace-nowrap"
                    >
                      <span>Stop & Analyze</span>
                    </button>
                  )}
                </div>
              </div>

              {isRecording && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-xs font-bold text-red-300">RECORDING IN PROGRESS</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white bg-black/40 px-3 py-1 rounded-md">
                    Duration: {recordingElapsed}s
                  </div>
                </div>
              )}

              <p className="text-[11px] text-gray-400">
                Captures stream footage in real-time. Once stopped, ClipGenius AI automatically detects the highest-energy highlights from the session.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video Loaded & Configuration Panel */}
      {videoData && (
        <div className="space-y-8">
          {/* Video Metadata Card */}
          <div className="p-6 rounded-2xl bg-[#0e101a] border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-purple-500/5">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-28 h-20 rounded-xl bg-gray-900 overflow-hidden shrink-0 border border-gray-800">
                {videoData.thumbnail_url ? (
                  <img src={videoData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <Film className="w-8 h-8 text-gray-600 m-auto" />
                )}
                <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                  {Math.round(videoData.duration)}s
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {videoData.filename}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{videoData.width} × {videoData.height}</span>
                  <span>•</span>
                  <span>{videoData.fps} FPS</span>
                  <span>•</span>
                  <span>{(videoData.size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Ready for 9:16</span>
                </div>
              </div>
            </div>

            {/* Replace Button */}
            <button
              onClick={() => {
                setVideoData(null);
                setGeneratedClips([]);
              }}
              className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-red-500/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Replace Video</span>
            </button>
          </div>

          {/* AI Settings Controls */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0f18] border border-gray-800/80 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>AI Clipping Configuration</span>
              </h3>
              <span className="text-xs text-purple-400 font-semibold">1080×1920 9:16 Vertical Default</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Setting 1: Duration */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Target Clip Duration
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[15, 30, 45, 60, 90].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setTargetDuration(dur)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        targetDuration === dur
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-[#121422] text-gray-400 hover:text-white border border-gray-800'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 2: Number of Clips */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-2">
                  <span>Max Generated Clips</span>
                  <span className="text-purple-400 font-bold">{maxClips} clips</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxClips}
                  onChange={(e) => setMaxClips(parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1 clip</span>
                  <span>5 clips</span>
                  <span>10 clips</span>
                </div>
              </div>

              {/* Setting 3: 9:16 Conversion Mode */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  9:16 Vertical Framing Mode
                </label>
                <select
                  value={cropMode}
                  onChange={(e) => setCropMode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#121422] border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="blurred_bg">Blurred Background (Standard)</option>
                  <option value="smart_crop">AI Smart Crop (Face Tracking)</option>
                  <option value="zoom_fill">Zoom to Fill (Full Canvas)</option>
                  <option value="split_screen">Podcast Split Screen (2-Cam)</option>
                </select>
              </div>

              {/* Setting 4: Template Theme */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Viral Caption Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#121422] border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="hormozi_captions">Hormozi Captions (Yellow Highlight)</option>
                  <option value="mrbeast">MrBeast High-Energy (Neon Yellow)</option>
                  <option value="gta6_viral">GTA 6 Viral (Cyber Glow)</option>
                  <option value="bgmi_highlights">BGMI Headshot Highlights</option>
                  <option value="modern_podcast">Modern Minimalist Podcast</option>
                  <option value="funny_moments">Funny Moments (Karaoke Bounce)</option>
                  <option value="facts_shorts">Educational Facts Shorts</option>
                </select>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="pt-2 text-center">
              <button
                onClick={handleGenerateClips}
                disabled={isLoading}
                className="w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-xl shadow-purple-600/35 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
              >
                <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                <span>GENERATE VIRAL CLIPS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Clips Gallery */}
      {generatedClips.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>AI Generated Clips ({generatedClips.length})</span>
              </h2>
              <p className="text-xs text-gray-400">
                All clips formatted to 9:16 with AI hooks, captions, and viral metadata. Preview and download in Full HD.
              </p>
            </div>

            <button
              onClick={() => {
                // Batch download all clips
                generatedClips.forEach((c) => handleQuickExport(c));
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Clips (1080p)</span>
            </button>
          </div>

          {/* Clips List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {generatedClips.map((clip, index) => {
              const isRendering = isRenderingClipId === clip.id;
              return (
                <div
                  key={clip.id}
                  className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800/80 hover:border-purple-500/40 transition-all shadow-xl space-y-5"
                >
                  {/* Top Bar: Title & Engagement Score */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                          Clip #{index + 1}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">
                          {clip.highlight_category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {clip.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-amber-400 flex items-center gap-1 justify-end">
                        <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{clip.score}%</span>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        Viral Score
                      </span>
                    </div>
                  </div>

                  {/* Center: Video Preview & Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Vertical 9:16 Video Player Container */}
                    <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-xl bg-black overflow-hidden border border-gray-800 shadow-md">
                      <video
                        src={clip.rendered_url || videoData?.url}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                      />
                      <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded text-white">
                        9:16 HD
                      </span>
                      <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-[9px] font-mono px-2 py-0.5 rounded text-white">
                        {clip.duration}s
                      </span>
                    </div>

                    {/* Clip Info & AI Hook */}
                    <div className="space-y-3 text-xs">
                      {/* Timestamps */}
                      <div className="p-3 rounded-xl bg-[#121422] border border-gray-800 space-y-1">
                        <div className="flex justify-between text-gray-400">
                          <span>Start Time:</span>
                          <span className="text-white font-mono">{clip.start_time}s</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>End Time:</span>
                          <span className="text-white font-mono">{clip.end_time}s</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Duration:</span>
                          <span className="text-emerald-400 font-mono font-bold">{clip.duration}s</span>
                        </div>
                      </div>

                      {/* Hook Box */}
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Hook</span>
                          </span>
                          <button
                            onClick={() => handleRegenerateHooks(clip.id, clip.highlight_category)}
                            title="Regenerate Hook"
                            className="text-gray-400 hover:text-white"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-purple-200 font-medium italic">
                          "{clip.hook}"
                        </p>
                      </div>

                      {/* Selection Reason */}
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <span className="text-gray-300 font-semibold">Why selected: </span>
                        {clip.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(clip.title, `title_${clip.id}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copyStatus[`title_${clip.id}`] ? 'Copied!' : 'Copy Title'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(clip.seo_descriptions?.hashtags || '#viral #shorts', `seo_${clip.id}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copyStatus[`seo_${clip.id}`] ? 'Copied!' : 'Copy Tags'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEditor && onOpenEditor(clip, videoData)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-gray-200 bg-[#151726] hover:bg-[#1c2033] border border-gray-700 hover:border-purple-500/50 flex items-center gap-1.5 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        <span>Edit Studio</span>
                      </button>

                      <button
                        onClick={() => handleQuickExport(clip)}
                        disabled={isRendering}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
                      >
                        {isRendering ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Rendering 1080p...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Export 1080p</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
