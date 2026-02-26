import React, { useEffect, useState } from 'react';
import { Play, Home, Trophy, Star, Clock, Zap } from 'lucide-react';

const LevelCompleteOverlay = ({ onNextLevel, onMenu, score, time }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

    // Star rating based on time used
    const stars = time < 60 ? 3 : time < 120 ? 2 : 1;

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-600 ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'radial-gradient(ellipse at center, rgba(14,45,80,0.6) 0%, rgba(0,0,0,0.88) 100%)', backdropFilter: 'blur(10px)' }}>

            <div className={`relative w-full max-w-sm mx-4 transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>

                {/* Outer glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-cyan-500/20 to-blue-800/10 blur-2xl" />

                {/* Stars floating above */}
                <div className="absolute -top-8 left-0 right-0 flex items-center justify-center gap-3 z-10">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`transition-all duration-500`}
                            style={{ transitionDelay: `${200 + i * 100}ms`, transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.5)', opacity: visible ? 1 : 0 }}>
                            <Star className={`w-10 h-10 drop-shadow-lg ${i < stars ? 'text-yellow-300 fill-yellow-300' : 'text-gray-600 fill-gray-700'}`}
                                style={{ filter: i < stars ? 'drop-shadow(0 0 8px rgba(234,179,8,0.8))' : 'none' }} />
                        </div>
                    ))}
                </div>

                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden border border-cyan-400/20"
                    style={{ background: 'linear-gradient(160deg, #071c30 0%, #050f1e 60%, #040b17 100%)' }}>

                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                    <div className="p-8 pt-10 text-center">
                        {/* Trophy */}
                        <div className="mb-4 inline-flex relative">
                            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse rounded-full" />
                            <div className="relative w-20 h-20 rounded-full bg-yellow-950/40 border border-yellow-500/25 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-md" />
                            </div>
                        </div>

                        <div className="text-[10px] font-bold tracking-[0.4em] text-cyan-500/60 uppercase mb-1">// OBJECTIVE COMPLETE</div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-blue-400 italic tracking-tighter mb-5">
                            STAGE CLEAR
                        </h2>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="rounded-2xl p-3 text-left"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3 h-3 text-cyan-400" />
                                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Time Used</div>
                                </div>
                                <div className="text-2xl font-black font-mono text-white">{time}<span className="text-sm text-gray-400 font-normal ml-1">s</span></div>
                            </div>
                            <div className="rounded-2xl p-3 text-left"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Zap className="w-3 h-3 text-yellow-400" />
                                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Score</div>
                                </div>
                                <div className="text-2xl font-black font-mono text-yellow-400">{score.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onNextLevel}
                                className="group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black tracking-[0.15em] text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #0891b2, #1d4ed8)' }}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }} />
                                <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
                                <span className="relative z-10">NEXT MISSION</span>
                                <Play className="w-4 h-4 fill-current relative z-10 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={onMenu}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-gray-400 hover:text-white border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all tracking-widest">
                                <Home className="w-4 h-4" />
                                RETURN TO BASE
                            </button>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-800/50 to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default LevelCompleteOverlay;
