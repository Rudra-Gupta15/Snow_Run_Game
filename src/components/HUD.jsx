import React from 'react';
import { Clock, MapPin, Gauge, Zap, ChevronRight } from 'lucide-react';

const HUD = ({ time, stage, stageName, speed, progress, totalDistance }) => {
    const isTimeLow = time < 30;
    const isTimeMid = time < 90 && time >= 30;
    const speedPercent = Math.min((speed / 30) * 100, 100);
    const progressPercent = Math.min(Math.max((progress / totalDistance) * 100, 0), 100);
    const mins = Math.floor(time / 60);
    const secs = Math.ceil(time % 60);

    return (
        <div className="absolute top-0 left-0 w-full pointer-events-none z-40 p-3 md:p-4 flex flex-col justify-between h-full pb-28 md:pb-10">

            {/* ── TOP BAR ── */}
            <div className="flex justify-between items-start gap-2">

                {/* Stage Badge */}
                <div className="flex items-center gap-2.5 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-2.5"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 md:p-2 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                        <div className="text-[8px] md:text-[9px] text-gray-400 uppercase font-bold tracking-[0.25em]">Stage {stage}</div>
                        <div className="text-[11px] md:text-xs font-black text-white tracking-wide leading-tight">{stageName.toUpperCase()}</div>
                    </div>
                </div>

                {/* Timer — center crown piece */}
                <div className={`flex flex-col items-center transition-all duration-300 ${isTimeLow ? 'scale-110' : ''}`}>
                    <div className="rounded-xl md:rounded-2xl px-4 md:px-6 py-1.5 md:py-2 flex items-center gap-2 md:gap-3"
                        style={{
                            background: isTimeLow ? 'rgba(127,5,5,0.7)' : isTimeMid ? 'rgba(80,40,0,0.65)' : 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(14px)',
                            border: `1px solid ${isTimeLow ? 'rgba(239,68,68,0.5)' : isTimeMid ? 'rgba(234,179,8,0.3)' : 'rgba(37,99,235,0.3)'}`,
                            boxShadow: isTimeLow ? '0 0 20px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,100,100,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.05)'
                        }}>
                        <Clock className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isTimeLow ? 'text-red-400 animate-pulse' : isTimeMid ? 'text-yellow-400' : 'text-blue-400'}`} />
                        <div className="flex items-baseline gap-1">
                            <span className={`text-2xl md:text-3xl font-black font-mono tracking-widest leading-none ${isTimeLow ? 'text-red-300' : isTimeMid ? 'text-yellow-200' : 'text-white'}`}>
                                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    {isTimeLow && (
                        <div className="text-[8px] text-red-400 font-bold tracking-[0.3em] animate-pulse mt-0.5">⚠ TIME CRITICAL</div>
                    )}
                </div>

                {/* Speed Badge */}
                <div className="flex items-center gap-2 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-2.5"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                    <div>
                        <div className="text-[8px] md:text-[9px] text-gray-400 uppercase font-bold tracking-[0.25em] text-right">Speed</div>
                        <div className="text-[11px] md:text-sm font-black text-white text-right">
                            {Math.round(speed * 3)}<span className="text-[8px] text-gray-400 font-normal ml-0.5">km/h</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-1.5 md:p-2 rounded-lg border border-cyan-500/20">
                        <Gauge className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="flex items-end gap-3">

                {/* Circular Speedometer */}
                <div className="relative w-14 h-14 md:w-24 md:h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 80 80">
                        {/* Track */}
                        <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="transparent"
                            strokeDasharray="201" strokeDashoffset="50" />
                        {/* Speed fill */}
                        <circle cx="40" cy="40" r="32" stroke="url(#hudSpeedGrad)" strokeWidth="7" fill="transparent"
                            strokeDasharray="201"
                            strokeDashoffset={201 - (201 * 0.75 * (speedPercent / 100))}
                            strokeLinecap="round"
                            className="transition-all duration-150 ease-out" />
                        <defs>
                            <linearGradient id="hudSpeedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="60%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm md:text-lg font-black text-white leading-none">{Math.round(speed * 3)}</span>
                        <span className="text-[6px] md:text-[8px] text-gray-400 uppercase tracking-wider font-bold">km/h</span>
                    </div>
                </div>

                {/* Progress Bar — full width */}
                <div className="flex-1 mb-0.5">
                    <div className="flex justify-between text-[7px] md:text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-1.5">
                        <span className="flex items-center gap-1"><ChevronRight className="w-2 h-2" />START</span>
                        <span className="text-cyan-400">{Math.round(progressPercent)}%</span>
                        <span className="flex items-center gap-1 flex-row-reverse"><ChevronRight className="w-2 h-2 rotate-180" />FINISH</span>
                    </div>
                    <div className="relative h-2.5 md:h-3.5 w-full rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {/* Fill */}
                        <div className="h-full rounded-full transition-all duration-100 ease-linear relative"
                            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #0891b2, #2563eb, #7c3aed)', boxShadow: '0 0 12px rgba(59,130,246,0.6)' }}>
                            {/* Leading glow dot */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_4px_rgba(100,200,255,0.6)]" />
                        </div>
                        {/* Grid lines */}
                        <div className="absolute inset-0 w-full h-full opacity-30"
                            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 19%, rgba(255,255,255,0.15) 20%)' }} />
                    </div>

                    {/* Boost hint */}
                    <div className="mt-1.5 flex items-center gap-2 opacity-50">
                        <Zap className="w-2.5 h-2.5 text-cyan-400" />
                        <span className="text-[7px] md:text-[8px] text-cyan-300 font-bold tracking-[0.2em]">BOOST [E]</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HUD;
