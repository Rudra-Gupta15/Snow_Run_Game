import React from 'react';
import { Clock, MapPin, Gauge, Flag } from 'lucide-react';

const HUD = ({ time, stage, stageName, speed, progress, totalDistance }) => {
    const isTimeLow = time < 30;
    const speedPercent = Math.min((speed / 30) * 100, 100);
    const progressPercent = Math.min(Math.max((progress / totalDistance) * 100, 0), 100);

    return (
        <div className="absolute top-0 left-0 w-full p-2 md:p-4 pointer-events-none z-40 flex flex-col justify-between h-full pb-4 md:pb-8">
            {/* Top Bar */}
            <div className="flex justify-between items-start w-full max-w-7xl mx-auto gap-2">
                {/* Stage Info */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/10 flex items-center gap-2 md:gap-3 text-white shadow-lg">
                    <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-wider">Mission {stage}</div>
                        <div className="text-xs md:text-sm font-bold text-white tracking-wide">{stageName}</div>
                    </div>
                </div>

                {/* Timer */}
                <div className={`flex flex-col items-center transition-all duration-500 ${isTimeLow ? 'scale-110' : ''}`}>
                    <div className={`backdrop-blur-md rounded-full px-3 md:px-6 py-1.5 md:py-2 border shadow-xl flex items-center gap-2 md:gap-3 ${isTimeLow ? 'bg-red-950/80 border-red-500 animate-pulse' : 'bg-black/60 border-blue-500/30'}`}>
                        <Clock className={`w-4 h-4 md:w-5 md:h-5 ${isTimeLow ? 'text-red-500' : 'text-blue-400'}`} />
                        <span className={`text-xl md:text-3xl font-mono font-black tracking-widest ${isTimeLow ? 'text-red-400' : 'text-white'}`}>
                            {Math.ceil(time).toString().padStart(3, '0')}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-gray-500 self-end mb-0.5">SEC</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Stats */}
            <div className="flex justify-between items-end w-full max-w-7xl mx-auto px-2 md:px-4">

                {/* Speedometer */}
                <div className="relative w-16 h-16 md:w-32 md:h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background arc */}
                        <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" />
                        {/* Speed arc */}
                        <circle cx="50" cy="50" r="40" stroke="url(#speedGradient)" strokeWidth="8" fill="transparent"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * 0.75 * (speedPercent / 100))}
                            strokeLinecap="round"
                            className="transition-all duration-200 ease-out"
                        />
                        <defs>
                            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm md:text-2xl font-black text-white">{Math.round(speed * 3)}</span>
                        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-wider font-bold">km/h</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 mx-3 md:mx-12 mb-2 md:mb-4">
                    <div className="flex justify-between text-[8px] md:text-xs text-gray-400 font-bold tracking-widest mb-1 uppercase">
                        <span>Start</span>
                        <span>{Math.round((progress / totalDistance) * 100)}%</span>
                        <span>Finish</span>
                    </div>
                    <div className="h-2 md:h-3 w-full bg-gray-800 rounded-full border border-gray-700 relative overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-100 ease-linear rounded-full relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-0 h-full w-1 bg-white opacity-50"></div>
                        </div>
                        {/* Grid lines */}
                        <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_19%,rgba(255,255,255,0.1)_20%)]"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HUD;
