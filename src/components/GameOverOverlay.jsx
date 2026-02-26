import React, { useEffect, useState } from 'react';
import { RotateCcw, Home, Skull, AlertTriangle } from 'lucide-react';

const GameOverOverlay = ({ onRetry, onMenu, reason = "CRASHED" }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'radial-gradient(ellipse at center, rgba(127,29,29,0.55) 0%, rgba(0,0,0,0.88) 100%)', backdropFilter: 'blur(8px)' }}>

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }} />

            <div className={`relative w-full max-w-sm mx-4 transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}>
                {/* Outer glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-600/30 to-red-900/10 blur-xl" />

                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden border border-red-500/25"
                    style={{ background: 'linear-gradient(160deg, #1a0a0a 0%, #120505 60%, #0d0808 100%)' }}>

                    {/* Top accent strip */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                    <div className="p-8 text-center">
                        {/* Icon */}
                        <div className="mb-5 inline-flex relative">
                            <div className="absolute inset-0 bg-red-600 blur-2xl opacity-40 animate-pulse rounded-full" />
                            <div className="relative w-20 h-20 rounded-full bg-red-950/80 border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                                <Skull className="w-10 h-10 text-red-400" />
                            </div>
                        </div>

                        <div className="text-[10px] font-bold tracking-[0.4em] text-red-500/70 uppercase mb-1">// SYSTEM ERROR</div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-300 to-red-600 italic tracking-tighter mb-3 drop-shadow-md">
                            MISSION FAILED
                        </h2>

                        <div className="flex items-center justify-center gap-2 mb-8">
                            <AlertTriangle className="w-3 h-3 text-red-400/60" />
                            <div className="text-red-400/70 font-mono text-[11px] tracking-widest uppercase">
                                {reason}
                            </div>
                            <AlertTriangle className="w-3 h-3 text-red-400/60" />
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent mb-6" />

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onRetry}
                                className="group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black tracking-[0.15em] text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
                                <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500 relative z-10" />
                                <span className="relative z-10">RETRY MISSION</span>
                            </button>
                            <button
                                onClick={onMenu}
                                className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-gray-400 hover:text-white border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all tracking-widest">
                                <Home className="w-4 h-4" />
                                ABORT MISSION
                            </button>
                        </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default GameOverOverlay;
