import React, { useState } from 'react';
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
    <div className="w-screen h-screen overflow-hidden bg-black font-sans select-none relative">
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
    </div>
  );
}

export default App;
