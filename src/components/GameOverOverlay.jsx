import React from 'react';
import { RotateCcw, Home, Skull } from 'lucide-react';

const GameOverOverlay = ({ onRetry, onMenu, reason = "CRASHED" }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-red-950/40 p-8 rounded-2xl border border-red-500/30 text-center max-w-sm w-full shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                <div className="mb-6 inline-flex relative">
                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                    <Skull className="w-20 h-20 text-red-500 relative z-10" />
                </div>

                <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 drop-shadow-md">
                    MISSION FAILED
                </h2>
                <div className="text-red-300 font-mono text-sm tracking-widest uppercase mb-8 border-t border-red-500/30 pt-2">
                    {reason}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onRetry}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg group"
                    >
                        <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
                        RETRY
                    </button>
                    <button
                        onClick={onMenu}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-semibold rounded-xl border border-white/10 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        ABORT MISSION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverOverlay;
