import React from 'react';
import { 
  Sparkles, 
  Upload, 
  Link as LinkIcon, 
  Radio, 
  ArrowRight, 
  Flame, 
  Video, 
  Type, 
  Layers, 
  Scissors, 
  Smartphone, 
  Hash, 
  Download,
  CheckCircle2,
  Play
} from 'lucide-react';

export default function Home({ onSelectInputMode, setActivePage }) {
  const features = [
    {
      icon: Scissors,
      title: 'AI Viral Clipping',
      desc: 'Deep multi-modal analysis detects conversational climaxes, unexpected moments and exciting spikes with natural sentence pacing.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Flame,
      title: 'Smart Highlight Detection',
      desc: 'Scans audio waveform variance, vocal intensity and scene changes to pinpoint the most engaging moments automatically.',
      color: 'from-amber-500 to-rose-500'
    },
    {
      icon: Sparkles,
      title: 'AI Hook Generator',
      desc: 'Generates 12 categories of high-converting opening hooks (Curiosity, Shocking, Gaming, Suspense, Funny) to boost 3-second retention.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Type,
      title: 'Animated Captions',
      desc: '15 viral caption styles including Hormozi, MrBeast, Gaming Cyber, Karaoke & Neon with word-by-word synchronized animations.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Layers,
      title: 'Viral Templates',
      desc: '21 production-grade templates tailored for GTA 6, BGMI, Podcasts, Entertainment shorts and Educational insights.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Smartphone,
      title: 'Smart 9:16 Conversion',
      desc: 'Converts landscape 16:9 videos into vertical 9:16 shorts using AI face detection, blurred background padding or dynamic zoom.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: Hash,
      title: 'AI Titles & Descriptions',
      desc: 'Auto-generates 5 viral titles, SEO descriptions, and trending hashtag sets ready for YouTube Shorts, Reels and TikTok.',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: Download,
      title: 'Free 1080p Export',
      desc: 'Export Full HD 1080×1920 MP4 video files locally with zero watermarks, zero subscription fees and zero speed throttles.',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 text-center max-w-5xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-blue-600/15 to-pink-600/10 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm shadow-purple-500/20">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>The 100% Free Open-Source OpusClip Alternative</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
          Turn Long Videos Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            Viral Shorts With AI.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          Upload your video, paste a link or record a live stream. Let AI find the most interesting moments, add engaging hooks, animated captions and professional effects. Download your shorts in Full HD for free.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => {
              onSelectInputMode('upload');
              setActivePage('create');
            }}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-xl shadow-purple-600/30 flex items-center gap-2.5 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Creating</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => {
              onSelectInputMode('upload');
              setActivePage('create');
            }}
            className="px-6 py-4 rounded-2xl font-semibold text-sm text-gray-200 bg-[#12141f] hover:bg-[#1a1d2e] border border-gray-800 hover:border-gray-700 flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload Video</span>
          </button>

          <button
            onClick={() => {
              onSelectInputMode('url');
              setActivePage('create');
            }}
            className="px-6 py-4 rounded-2xl font-semibold text-sm text-gray-200 bg-[#12141f] hover:bg-[#1a1d2e] border border-gray-800 hover:border-gray-700 flex items-center gap-2 transition-all"
          >
            <LinkIcon className="w-4 h-4 text-blue-400" />
            <span>Paste Video Link</span>
          </button>
        </div>

        {/* 3 Prominent Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card A: Upload */}
          <div 
            onClick={() => {
              onSelectInputMode('upload');
              setActivePage('create');
            }}
            className="group relative p-6 rounded-2xl bg-[#0e101a] border border-purple-500/20 hover:border-purple-500/50 hover:bg-[#131624] transition-all cursor-pointer shadow-lg hover:shadow-purple-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">Option A</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Upload Video</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Select files from your device. Supports MP4, MOV, MKV, AVI, and WEBM up to 4K resolution.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Choose file</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card B: Paste URL */}
          <div 
            onClick={() => {
              onSelectInputMode('url');
              setActivePage('create');
            }}
            className="group relative p-6 rounded-2xl bg-[#0e101a] border border-blue-500/20 hover:border-blue-500/50 hover:bg-[#131624] transition-all cursor-pointer shadow-lg hover:shadow-blue-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LinkIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">Option B</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Paste Video URL</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Paste YouTube or direct MP4 video URLs for instant extraction and automatic processing.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Paste link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card C: Live Stream */}
          <div 
            onClick={() => {
              onSelectInputMode('stream');
              setActivePage('create');
            }}
            className="group relative p-6 rounded-2xl bg-[#0e101a] border border-red-500/20 hover:border-red-500/50 hover:bg-[#131624] transition-all cursor-pointer shadow-lg hover:shadow-red-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-red-400 tracking-wider uppercase">Option C</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Live Stream</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Connect to supported live streams or streams in real-time, record live footage and generate instant highlights.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-red-300 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Connect stream</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Engineered For Virality. Built For Creators.
          </h2>
          <p className="text-sm text-gray-400">
            Everything you need to turn raw gameplay, podcasts, interviews and reactions into high-retention shorts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-[#0d0f18] border border-gray-800/80 hover:border-purple-500/30 transition-all hover:-translate-y-1 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121422] to-[#0d0e17] border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Free vs Paid Services</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Why Pay $40/mo When ClipGenius AI Runs Free On Your Machine?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Paid platforms throttle your rendering, slap intrusive watermarks, and limit you to a few minutes of video. ClipGenius AI gives you unlimited 1080p rendering with local AI models.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-200">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Watermarks</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Login Required</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited 1080p Export</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Local Processing</div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectInputMode('upload');
                setActivePage('create');
              }}
              className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 whitespace-nowrap active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
