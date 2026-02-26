import React from 'react';
import { Play, Trophy, Settings, LogOut } from 'lucide-react';
import SFX from '../utils/soundManager';

const MainMenu = ({ onStart, onLevelSelect, onSettings, onQuit }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden font-sans flex flex-col">

            {/* ── Background ── */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/snow_bg.jpg"
                    alt="Snow Mountains"
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay — darker at bottom for buttons readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/50" />
                <div className="absolute inset-0 backdrop-blur-[1px]" />
            </div>

            {/* ── Ambient glow particle ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30 animate-pulse"
                style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.2) 0%, transparent 70%)' }} />

            {/* ── Top: Branding section ── */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-10 pb-4 gap-4">

                {/* Logo circle */}
                <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full p-1
                    bg-gradient-to-tr from-cyan-400 to-blue-600
                    shadow-[0_0_30px_rgba(0,200,255,0.5)] animate-float flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black/50 border-2 border-white/10">
                        <img
                            src="/logo.png"
                            alt="Snow Run"
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                    {/* Orbit ring */}
                    <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-spin"
                        style={{ animationDuration: '8s' }} />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-5xl md:text-8xl font-[900] text-transparent bg-clip-text
                        bg-gradient-to-b from-white via-cyan-100 to-cyan-400
                        tracking-tighter italic drop-shadow-[0_4px_20px_rgba(0,200,255,0.4)]"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        SNOW RUN
                    </h1>
                    <p className="text-cyan-300/50 text-xs md:text-sm tracking-[0.4em] font-mono mt-1 uppercase">
                        v2.1 Frostbite Edition
                    </p>
                </div>

                {/* Secondary buttons — row on mobile, stacked on desktop */}
                <div className="flex flex-row md:flex-col gap-3 mt-2 w-full max-w-xs">
                    <button
                        onClick={() => { SFX.click(); onLevelSelect(); }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                            font-bold text-xs md:text-sm tracking-widest text-cyan-100
                            border border-white/10 hover:border-cyan-400/40
                            bg-white/5 hover:bg-white/10 backdrop-blur-md
                            transition-all hover:scale-[1.02] active:scale-95">
                        <Trophy className="w-4 h-4 text-cyan-400" />
                        LEVELS
                    </button>

                    <button
                        onClick={() => { SFX.click(); onSettings(); }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                            font-bold text-xs md:text-sm tracking-widest text-cyan-100
                            border border-white/10 hover:border-cyan-400/40
                            bg-white/5 hover:bg-white/10 backdrop-blur-md
                            transition-all hover:scale-[1.02] active:scale-95">
                        <Settings className="w-4 h-4 text-cyan-400" />
                        SETTINGS
                    </button>

                    <button
                        onClick={() => { SFX.click(); onQuit(); }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                            font-bold text-xs md:text-sm tracking-widest text-red-300/70
                            border border-white/5 hover:border-red-500/30
                            bg-white/3 hover:bg-red-950/30 backdrop-blur-md
                            transition-all hover:scale-[1.02] active:scale-95">
                        <LogOut className="w-4 h-4" />
                        QUIT
                    </button>
                </div>
            </div>

            {/* ── Bottom: BIG PLAY BUTTON pinned at bottom ── */}
            {/* This is the "blue padding" area the user wants to use */}
            <div className="relative z-10 px-5 pb-8 pt-4 flex-shrink-0"
                style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))' }}>

                {/* Glow line above */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mb-5" />

                <button
                    onClick={() => { SFX.click(); onStart(); }}
                    className="group relative w-full py-5 md:py-6 rounded-2xl overflow-hidden
                        font-black text-white text-lg md:text-2xl tracking-[0.2em]
                        transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
                    style={{
                        background: 'linear-gradient(135deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)',
                        boxShadow: '0 0 40px rgba(6,182,212,0.4), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}>
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)', animation: 'shimmer 1.5s linear infinite', backgroundSize: '200% auto' }} />

                    <span className="relative z-10 flex items-center justify-center gap-3">
                        <Play className="w-6 h-6 md:w-7 md:h-7 fill-current drop-shadow" />
                        PLAY GAME
                    </span>

                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors" />
                </button>

                <p className="text-center text-[9px] text-white/15 font-mono tracking-[0.4em] mt-3">
                    BUILT BY RUDRA_KUMAR_GUPTA
                </p>
            </div>
        </div>
    );
};

export default MainMenu;
