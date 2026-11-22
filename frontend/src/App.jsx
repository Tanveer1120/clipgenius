import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateClips from './pages/CreateClips';
import Editor from './pages/Editor';
import Templates from './pages/Templates';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import About from './pages/About';
import { getTemplates } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'create', 'editor', 'templates', 'projects', 'settings', 'about'
  const [inputMode, setInputMode] = useState('upload'); // 'upload', 'url', 'stream'
  const [templates, setTemplates] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Shared Studio Editor State
  const [activeClipForEditor, setActiveClipForEditor] = useState(null);
  const [activeVideoForEditor, setActiveVideoForEditor] = useState(null);

  // Load Templates & Stored Projects on Launch
  useEffect(() => {
    async function loadInitialData() {
      try {
        const tpls = await getTemplates();
        if (Array.isArray(tpls)) {
          setTemplates(tpls);
        }
      } catch (e) {
        console.error('Failed to load templates:', e);
      }

      // Load Projects from LocalStorage
      try {
        const stored = localStorage.getItem('clipgenius_projects');
        if (stored) {
          setProjects(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to parse projects from storage:', e);
      }
    }
    loadInitialData();
  }, []);

  // Save New Project to LocalStorage
  const handleSaveToProject = (videoData, clips) => {
    if (!videoData) return;
    const newProj = {
      id: videoData.video_id,
      name: videoData.filename.replace(/\.[^/.]+$/, "") + " Shorts",
      created_at: new Date().toISOString(),
      video: videoData,
      clips: clips
    };

    const updated = [newProj, ...projects.filter(p => p.id !== newProj.id)];
    setProjects(updated);
    try {
      localStorage.setItem('clipgenius_projects', JSON.stringify(updated));
    } catch (e) {}
  };

  // Open a clip in AI Video Editor
  const handleOpenEditor = (clip, videoData) => {
    setActiveClipForEditor(clip);
    setActiveVideoForEditor(videoData);
    setActivePage('editor');
  };

  // Open an entire project
  const handleOpenProject = (proj) => {
    setActiveVideoForEditor(proj.video);
    if (proj.clips && proj.clips.length > 0) {
      setActiveClipForEditor(proj.clips[0]);
    }
    setActivePage('editor');
  };

  // Delete a project
  const handleDeleteProject = (projId) => {
    const updated = projects.filter(p => p.id !== projId);
    setProjects(updated);
    try {
      localStorage.setItem('clipgenius_projects', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-gray-100 font-sans selection:bg-purple-600 selection:text-white">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage}
        projectsCount={projects.length}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <Home 
            onSelectInputMode={(mode) => setInputMode(mode)}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'create' && (
          <CreateClips
            initialMode={inputMode}
            onOpenEditor={handleOpenEditor}
            onSaveToProject={handleSaveToProject}
            templates={templates}
          />
        )}

        {activePage === 'editor' && (
          <Editor
            currentClip={activeClipForEditor}
            videoData={activeVideoForEditor}
            onBackToClips={() => setActivePage('create')}
            templates={templates}
          />
        )}

        {activePage === 'templates' && (
          <Templates
            templates={templates}
            onSelectTemplate={(tpl) => {
              // Pre-select template
              setActivePage('create');
            }}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'projects' && (
          <Projects
            projects={projects}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'settings' && (
          <Settings />
        )}

        {activePage === 'about' && (
          <About />
        )}
      </main>

      {activePage !== 'editor' && (
        <Footer setActivePage={setActivePage} />
      )}
    </div>
  );
}
