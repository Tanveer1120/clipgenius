import React, { useState } from 'react';
import { FolderGit2, Film, Clock, Download, Trash2, Edit3, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function Projects({ projects = [], onOpenProject, onDeleteProject, setActivePage }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setEditTitle(p.name);
  };

  const handleSaveTitle = (p) => {
    p.name = editTitle;
    setEditingId(null);
    localStorage.setItem('clipgenius_projects', JSON.stringify(projects));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-purple-400" />
            <span>My Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Locally saved video clipping sessions. Re-open, adjust timestamps or export clips at any time.
          </p>
        </div>

        <button
          onClick={() => setActivePage('create')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-600/25 flex items-center gap-2 self-start active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List or Empty State */}
      {projects.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0c0e17] border border-gray-800/80 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/15 text-purple-400 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Projects Yet</h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
            Upload your first video, paste a URL or record a stream to generate viral clips. Your project will automatically be saved here.
          </p>
          <button
            onClick={() => setActivePage('create')}
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 inline-flex items-center gap-2"
          >
            <span>Start Creating Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-[#0d0f18] border border-gray-800/80 hover:border-purple-500/40 p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
            >
              <div className="space-y-3">
                {/* Thumbnail & Badges */}
                <div className="relative aspect-video rounded-xl bg-gray-900 overflow-hidden border border-gray-800">
                  {proj.video?.thumbnail_url ? (
                    <img src={proj.video.thumbnail_url} alt="Project" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Film className="w-10 h-10 text-gray-600 m-auto" />
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white">
                    {Math.round(proj.video?.duration || 0)}s
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-600/90 text-[10px] font-bold text-white">
                    {proj.clips?.length || 0} Clips
                  </span>
                </div>

                {/* Title */}
                <div>
                  {editingId === proj.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 bg-black text-xs text-white border border-purple-500 rounded"
                      />
                      <button onClick={() => handleSaveTitle(proj)} className="p-1 bg-purple-600 text-white rounded">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                        {proj.name}
                      </h3>
                      <button
                        onClick={() => handleStartEdit(proj)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Created {new Date(proj.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
                <button
                  onClick={() => onDeleteProject && onDeleteProject(proj.id)}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-950/20 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenProject && onOpenProject(proj)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 transition-all active:scale-95"
                >
                  <span>Open Clips</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
