import React from 'react';
import { Lock, ChevronLeft } from 'lucide-react';
import SFX from '../utils/soundManager';

const levels = [
    { id: 1, name: 'Frozen Tundra', sub: 'The Awakening', difficulty: 'Easy', color: 'from-orange-400 to-yellow-500' },
    { id: 2, name: 'Glacial Caverns', sub: 'The Descent', difficulty: 'Medium', color: 'from-green-500 to-emerald-600' },
    { id: 3, name: 'Snowy Peak', sub: 'The Climb', difficulty: 'Hard', color: 'from-red-500 to-orange-600' },
    { id: 4, name: 'Ice Ridge', sub: 'The Summit', difficulty: 'Very Hard', color: 'from-purple-500 to-indigo-600' },
    { id: 5, name: 'Blizzard Run', sub: 'Boss Fight', difficulty: 'Insane', color: 'from-pink-500 to-rose-600' },
];

const difficultyColor = {
    Easy: 'text-green-400', Medium: 'text-yellow-400',
    Hard: 'text-orange-400', 'Very Hard': 'text-red-400', Insane: 'text-pink-400'
};

const LevelSelect = ({ onSelectLevel, onBack, unlockedStage = 5 }) => {
    return (
        <div className="absolute inset-0 flex flex-col z-50 overflow-hidden bg-black font-sans">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src="/snow_bg.jpg" alt="Background" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/60" />
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 flex flex-col h-full px-6 md:px-10 py-6 md:py-8">
                {/* Back button */}
                <button onClick={() => { SFX.click(); onBack(); }}
                    className="group mb-6 flex items-center gap-1.5 w-fit px-4 py-2 rounded-full text-cyan-300/60 hover:text-cyan-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold tracking-[0.3em]">BACK TO MENU</span>
                </button>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-6xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 tracking-tighter italic"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        SELECT STAGE
                    </h2>
                    <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-3 rounded-full" />
                </div>

                {/* Level cards — 5 columns, fills screen */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 flex-1 max-h-[65vh]">
                    {levels.map((level, index) => {
                        const isLocked = level.id > unlockedStage;
                        return (
                            <button
                                key={level.id}
                                onClick={() => { if (!isLocked) { SFX.click(); onSelectLevel(level.id); } }}
                                disabled={isLocked}
                                className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300
                                    ${isLocked
                                        ? 'opacity-40 grayscale cursor-not-allowed border-white/5 bg-white/3'
                                        : 'hover:scale-105 active:scale-95 border-white/10 hover:border-cyan-400/30 cursor-pointer'
                                    }
                                    backdrop-blur-lg`}
                                style={{
                                    background: isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                                    animationDelay: `${index * 0.08}s`,
                                    boxShadow: isLocked ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.1)'
                                }}>

                                {/* Hover glow */}
                                {!isLocked && (
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-8 transition-opacity blur-md`} />
                                )}

                                {/* Number badge */}
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-lg
                                    ${isLocked ? 'bg-black/40 border border-white/5' : `bg-gradient-to-tr ${level.color}`}
                                    transform group-hover:rotate-3 transition-transform duration-300`}>
                                    {isLocked
                                        ? <Lock className="w-5 h-5 text-gray-500" />
                                        : <span className="text-2xl md:text-3xl font-black text-white drop-shadow">{level.id}</span>
                                    }
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <div className="text-[11px] md:text-sm font-black text-white tracking-tight group-hover:text-cyan-200 transition-colors leading-tight">
                                        {level.name.toUpperCase()}
                                    </div>
                                    <div className="text-[8px] md:text-[9px] text-gray-500 mt-0.5 tracking-wider">{level.sub}</div>
                                    <div className={`text-[9px] md:text-[10px] font-bold tracking-[0.15em] mt-1.5 ${difficultyColor[level.difficulty]}`}>
                                        {level.difficulty.toUpperCase()}
                                    </div>
                                </div>

                                {/* Bottom glow line */}
                                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        );
                    })}
                </div>

                <p className="text-center text-[9px] text-white/15 font-mono tracking-[0.5em] mt-auto pt-4">
                    SELECT CARTRIDGE TO BOOT LEVEL
                </p>
            </div>
        </div>
    );
};

export default LevelSelect;
