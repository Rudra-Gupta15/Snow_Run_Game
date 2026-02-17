import React from 'react';
import { Play, Home, Trophy, Star } from 'lucide-react';

const LevelCompleteOverlay = ({ onNextLevel, onMenu, score, time }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
            {/* Confetti / Particle effects could go here */}

            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-1 rounded-3xl shadow-[0_0_100px_rgba(59,130,246,0.3)] max-w-sm w-full transform transition-all animate-in zoom-in-95 duration-300">
                <div className="bg-gray-900 rounded-[22px] p-8 text-center border border-white/10 relative overflow-hidden">
                    {/* Background Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 pointer-events-none"></div>

                    <div className="mb-6 relative inline-block">
                        <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
                        <Trophy className="w-20 h-20 text-yellow-400 relative z-10 drop-shadow-md" />

                        {/* Stars */}
                        <div className="absolute -top-2 -right-6 animate-bounce delay-100">
                            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div className="absolute -top-2 -left-6 animate-bounce delay-300">
                            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 italic tracking-tighter mb-2">
                        STAGE CLEAR
                    </h2>

                    <div className="grid grid-cols-2 gap-2 mb-8 mt-6">
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400 uppercase font-bold">Time</div>
                            <div className="text-xl font-mono text-white">{time}s</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400 uppercase font-bold">Score</div>
                            <div className="text-xl font-mono text-yellow-400">{score}</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onNextLevel}
                            className="relative flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/40 group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10">NEXT MISSION</span>
                            <Play className="w-5 h-5 fill-current relative z-10" />
                        </button>
                        <button
                            onClick={onMenu}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-semibold rounded-xl border border-white/10 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            RETURN TO BASE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelCompleteOverlay;
