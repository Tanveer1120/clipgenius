import React, { useState } from 'react';
import { LayoutTemplate, Sparkles, Flame, Gamepad2, Mic, Film, BookOpen, ArrowRight, Check } from 'lucide-react';

export default function Templates({ templates = [], onSelectTemplate, setActivePage }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Templates', icon: LayoutTemplate },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'podcast', label: 'Podcast & Talk', icon: Mic },
    { id: 'entertainment', label: 'Entertainment & Memes', icon: Film },
    { id: 'educational', label: 'Educational & Facts', icon: BookOpen }
  ];

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const handleUseTemplate = (tpl) => {
    if (onSelectTemplate) {
      onSelectTemplate(tpl);
    }
    setActivePage('create');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Converting Viral Presets</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Viral Template Library
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Hand-crafted editing presets calibrated for maximum watch-time on TikTok, Instagram Reels, and YouTube Shorts.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                  : 'bg-[#10121d] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="group rounded-2xl bg-[#0d0f18] border border-gray-800/80 hover:border-purple-500/50 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-purple-500/10"
          >
            {/* Visual Card Header & Gradient Preview */}
            <div className="space-y-3">
              <div className={`h-28 rounded-xl bg-gradient-to-r ${tpl.preview_gradient || 'from-purple-600 to-blue-600'} p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                    {tpl.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white">
                    9:16
                  </span>
                </div>
                
                {/* Visual Sample Subtitle */}
                <div className="text-center">
                  <span 
                    style={{ color: tpl.primary_color || '#FFF' }}
                    className="text-xs font-black uppercase tracking-wider drop-shadow-md"
                  >
                    "{tpl.name}"
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
            </div>

            {/* Template Specs */}
            <div className="space-y-2 pt-2 border-t border-gray-800/60 text-[11px] text-gray-400">
              <div className="flex justify-between">
                <span>Caption Style:</span>
                <span className="text-white font-medium capitalize">{tpl.caption_style?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Framing:</span>
                <span className="text-purple-300 font-medium capitalize">{tpl.crop_mode?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Sound Effect:</span>
                <span className="text-emerald-400 font-medium capitalize">{tpl.sound_effect || 'None'}</span>
              </div>
            </div>

            {/* Use Button */}
            <button
              onClick={() => handleUseTemplate(tpl)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600/20 group-hover:bg-purple-600 border border-purple-500/30 group-hover:border-transparent flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
