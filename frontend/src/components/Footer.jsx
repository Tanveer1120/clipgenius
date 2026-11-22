import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Zap, Download } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="border-t border-gray-800/80 bg-[#07080c] py-12 px-4 sm:px-6 lg:px-8 text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base tracking-wider">CLIPGENIUS AI</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The free, open-source local alternative to OpusClip, Vizard & Submagic. Turn any long video into viral 9:16 vertical shorts automatically.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Watermarks • No Registration</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => setActivePage('home')} className="hover:text-purple-400 transition-colors">Home</button></li>
            <li><button onClick={() => setActivePage('create')} className="hover:text-purple-400 transition-colors">Create Viral Clips</button></li>
            <li><button onClick={() => setActivePage('editor')} className="hover:text-purple-400 transition-colors">AI Video Editor Studio</button></li>
            <li><button onClick={() => setActivePage('templates')} className="hover:text-purple-400 transition-colors">Viral Templates</button></li>
            <li><button onClick={() => setActivePage('projects')} className="hover:text-purple-400 transition-colors">My Projects</button></li>
          </ul>
        </div>

        {/* AI Capabilities */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">AI Engine</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-purple-400" /> Faster-Whisper Speech Recognition</li>
            <li className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-yellow-400" /> Audio Energy & Peak Detection</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-blue-400" /> OpenCV Smart 9:16 Subject Tracking</li>
            <li className="flex items-center gap-1.5"><Download className="w-3 h-3 text-emerald-400" /> True 1080p FFmpeg Video Rendering</li>
          </ul>
        </div>

        {/* Core Rules */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">The Free Guarantee</h4>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3.5 text-xs space-y-1.5">
            <p className="text-gray-300 font-medium">100% Free & Local</p>
            <p className="text-[11px] text-gray-400">
              No subscription tiers, no paywalls, and no trial limits. All video processing and transcription run locally on your machine.
            </p>
            <div className="pt-2 text-[10px] text-purple-400">
              CLIPGENIUS AI v1.0 • Built with Pride
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
