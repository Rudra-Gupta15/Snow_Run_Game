import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import BikeGame from './components/BikeGame';
import SettingsOverlay from './components/SettingsOverlay';
import QuitOverlay from './components/QuitOverlay';

function App() {
  const [appState, setAppState] = useState('menu'); // 'menu', 'levelSelect', 'game'
  const [currentStage, setCurrentStage] = useState(1);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(5); // Unlock all levels by default for testing

  // Overlay States
  const [showSettings, setShowSettings] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Timer State (10 Minutes Total)
  const [globalTime, setGlobalTime] = useState(600);

  const handleStartGame = () => {
    setGlobalTime(600); // Reset timer
    setAppState('game');
  };

  const handleLevelSelect = () => {
    setAppState('levelSelect');
  };

  const handleSelectLevel = (levelId) => {
    setCurrentStage(levelId);
    setAppState('game');
  };

  const handleBackToMenu = () => {
    setAppState('menu');
  };

  const handleStageComplete = () => {
    if (currentStage < 5) {
      const nextStage = Number(currentStage) + 1;
      setMaxUnlockedStage(prev => Math.max(Number(prev), nextStage));
      setCurrentStage(nextStage);
      // We don't auto-reset appState here; BikeGame will handle the "Next Level" transition physically or via key reset
    } else {
      // Victory!
      setAppState('menu');
    }
  };

  const handleQuitGame = () => {
    setAppState('menu');
  };

  return (
    <div className={`w-screen h-screen overflow-hidden font-sans select-none relative ${appState === 'game' ? 'game-active' : ''}`}>
      {appState === 'menu' && (
        <MainMenu
          onStart={handleStartGame}
          onLevelSelect={handleLevelSelect}
          onSettings={() => setShowSettings(true)}
          onQuit={() => setShowQuitConfirm(true)}
        />
      )}

      {appState === 'levelSelect' && (
        <LevelSelect
          onSelectLevel={handleSelectLevel}
          onBack={handleBackToMenu}
          unlockedStage={maxUnlockedStage}
        />
      )}

      {appState === 'game' && (
        <BikeGame
          key={currentStage}
          stage={currentStage}
          globalTime={globalTime}
          setGlobalTime={setGlobalTime}
          onStageComplete={handleStageComplete}
          onGameOver={() => { }}
          onQuit={handleQuitGame}
        />
      )}

      {/* Overlays */}
      {showSettings && (
        <SettingsOverlay onClose={() => setShowSettings(false)} />
      )}

      {showQuitConfirm && (
        <QuitOverlay
          onConfirm={() => {
            setShowQuitConfirm(false);
            alert("Thanks for playing Snow Run! (In a real app, this would close the window)");
          }}
          onCancel={() => setShowQuitConfirm(false)}
        />
      )}

      {/* Global Footer */}
      <div className="absolute bottom-4 left-6 z-[60] pointer-events-none md:block hidden">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]"></div>
          <span className="text-[10px] font-bold text-cyan-100/60 uppercase tracking-[0.3em] whitespace-nowrap">
            Built by <span className="text-white">Rudra_Kumar_Gupta</span>
          </span>
        </div>
      </div>

      {/* Orientation Overlay */}
      <div className="orientation-overlay">
        <div className="bg-blue-600/20 p-8 rounded-full mb-6 relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          <Smartphone className="w-16 h-16 text-cyan-400 relative z-10" />
        </div>
        <h2 className="text-3xl font-[900] text-white mb-2 tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>
          LANDSCAPE REQUIRED
        </h2>
        <p className="text-cyan-200/60 font-medium">Please rotate your device to play</p>
      </div>
    </div>
  );
}

export default App;
