import React from 'react';
import { 
  Sparkles, 
  Film, 
  Sliders, 
  LayoutTemplate, 
  FolderGit2, 
  Settings, 
  Info,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, projectsCount = 0 }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Flame },
    { id: 'create', label: 'Create Clips', icon: Sparkles, badge: 'AI' },
    { id: 'editor', label: 'AI Video Editor', icon: Sliders },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'projects', label: 'My Projects', icon: FolderGit2, count: projectsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08090d]/80 border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
                  CLIPGENIUS
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-gray-400 tracking-tight hidden sm:block">
                Turn Every Video Into Viral Content
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'text-white bg-purple-600/15 border border-purple-500/30 shadow-sm shadow-purple-500/20' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-800 text-purple-300">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Free • No Watermark</span>
            </div>

            <button
              onClick={() => setActivePage('create')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-600/25 active:scale-95"
            >
              <span>Create Clips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Scroller */}
      <div className="md:hidden flex items-center gap-1 px-3 py-2 overflow-x-auto border-t border-gray-800/60 bg-[#0c0e17]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                isActive ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
