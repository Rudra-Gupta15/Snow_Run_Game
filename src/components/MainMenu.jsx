import React from 'react';
import { Play, Trophy, Settings } from 'lucide-react';

const MainMenu = ({ onStart, onLevelSelect, onSettings, onQuit }) => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 overflow-hidden bg-black font-sans">
            {/* ... (background and other sections remain unchanged) ... */}

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/snow_bg.jpg"
                    alt="Ice Mountains"
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60"></div>
                <div className="absolute inset-0 backdrop-blur-[1px]"></div>
            </div>

            {/* Snow/Particles Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

            {/* Main "Cylinder" Container */}
            <div className="relative z-10 flex flex-col items-center p-8 md:p-12 rounded-[3em] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(0,150,255,0.3)] max-w-2xl w-full mx-4 overflow-hidden ring-1 ring-white/30 transition-all hover:shadow-[0_0_80px_rgba(0,180,255,0.4)]">

                {/* Cylinder Highlight/Reflection */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                {/* Logo Section - Circular */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(0,200,255,0.6)] animate-float">
                        <div className="w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm border-2 border-white/10 relative">
                            <img
                                src="/logo.png"
                                alt="M&R Game Developer"
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    </div>
                </div>

                {/* Title Section */}
                <div className="text-center mb-8 relative w-full px-4">
                    <h1 className="text-5xl md:text-8xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tighter italic scale-y-110 break-words"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        SNOW RUN
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4 rounded-full shadow-[0_0_10px_cyan]"></div>
                </div>

                {/* Menu Buttons */}
                <div className="flex flex-col gap-4 w-full px-4">
                    <button
                        onClick={onStart}
                        className="group relative w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xl py-4 rounded-full transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] overflow-hidden border border-white/10"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                        <span className="relative z-10 tracking-[0.2em] flex items-center justify-center gap-2">
                            <Play className="w-5 h-5 fill-current" /> PLAY GAME
                        </span>
                    </button>

                    <button
                        onClick={onLevelSelect}
                        className="group relative w-full bg-black/40 hover:bg-black/60 text-cyan-50 font-semibold text-lg py-3 rounded-full transition-all border border-white/10 hover:border-cyan-400/50 backdrop-blur-md"
                    >
                        <span className="tracking-[0.15em] group-hover:text-cyan-300 transition-colors flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" /> LEVELS
                        </span>
                    </button>

                    <button
                        onClick={onSettings}
                        className="group relative w-full bg-black/40 hover:bg-black/60 text-cyan-50 font-semibold text-lg py-3 rounded-full transition-all border border-white/10 hover:border-cyan-400/50 backdrop-blur-md"
                    >
                        <span className="tracking-[0.15em] group-hover:text-cyan-300 transition-colors flex items-center justify-center gap-2">
                            <Settings className="w-4 h-4" /> SETTINGS
                        </span>
                    </button>

                    <button
                        onClick={onQuit}
                        className="group relative w-full bg-red-900/30 hover:bg-red-900/50 text-red-100/80 font-semibold text-lg py-3 rounded-full transition-all border border-white/5 hover:border-red-500/30 backdrop-blur-md"
                    >
                        <span className="tracking-[0.15em] group-hover:text-red-300 transition-colors">QUIT</span>
                    </button>
                </div>

                {/* Footer inside cylinder */}
                <div className="mt-8 text-[10px] text-cyan-200/40 font-mono tracking-[0.3em]">
                    v2.1 FROSTBITE
                </div>
            </div>
        </div>
    );
};

export default MainMenu;
