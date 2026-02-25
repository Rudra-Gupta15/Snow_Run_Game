import React from 'react';
import { Lock, Star, ChevronLeft } from 'lucide-react';

const LevelSelect = ({ onSelectLevel, onBack, unlockedStage = 5 }) => {
    const levels = [
        { id: 1, name: 'Frozen Tundra', difficulty: 'Easy', color: 'from-orange-400 to-yellow-600', shadow: 'shadow-orange-500/20' },
        { id: 2, name: 'Glacial Caverns', difficulty: 'Medium', color: 'from-green-500 to-emerald-700', shadow: 'shadow-emerald-500/20' },
        { id: 3, name: 'Snowy Peak', difficulty: 'Hard', color: 'from-red-500 to-orange-700', shadow: 'shadow-red-500/20' },
        { id: 4, name: 'Ice Ridge', difficulty: 'Very Hard', color: 'from-purple-500 to-indigo-700', shadow: 'shadow-indigo-500/20' },
        { id: 5, name: 'Blizzard Run', difficulty: 'Insane', color: 'from-pink-500 to-rose-700', shadow: 'shadow-rose-500/20' },
    ];

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 overflow-hidden bg-black font-sans">
            {/* Background Image - Same as Main Menu */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/snow_bg.jpg"
                    alt="Ice Mountains"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70"></div>
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 h-full flex flex-col py-6 md:py-12 overflow-y-auto landscape:overflow-y-visible">
                <button
                    onClick={onBack}
                    className="group mb-4 md:mb-8 flex items-center gap-2 text-cyan-200/60 hover:text-cyan-300 transition-all w-fit px-4 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="tracking-widest text-[10px] md:text-sm font-bold">BACK TO MENU</span>
                </button>

                <div className="text-center mb-6 md:mb-12 relative">
                    <h2 className="text-4xl md:text-7xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tighter italic scale-y-110"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        SELECT STAGE
                    </h2>
                    <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4 rounded-full shadow-[0_0_10px_cyan]"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 flex-1 items-center pb-8 md:pb-12">
                    {levels.map((level, index) => {
                        const isLocked = level.id > unlockedStage;
                        return (
                            <button
                                key={level.id}
                                onClick={() => !isLocked && onSelectLevel(level.id)}
                                disabled={isLocked}
                                className={`group relative flex flex-col items-center p-6 rounded-[2em] transition-all duration-500 transform hover:scale-105 active:scale-95 animate-fade-in-up h-72 w-full
                                    ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(0,150,255,0.3)]'}
                                    bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/20`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Glow Effect on Hover */}
                                {!isLocked && (
                                    <div className={`absolute inset-0 rounded-[2em] bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`}></div>
                                )}

                                {/* Level Number Icon */}
                                <div className="relative mb-6">
                                    {isLocked ? (
                                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-black/40 flex items-center justify-center border border-white/5">
                                            <Lock className="w-4 h-4 md:w-8 md:h-8 text-gray-500" />
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-tr ${level.color} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
                                            <span className="text-xl md:text-3xl font-black text-white drop-shadow-md">{level.id}</span>
                                        </div>
                                    )}
                                    {/* Reflection line */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30 rounded-full"></div>
                                </div>

                                <div className="text-center w-full">
                                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
                                        {level.name.toUpperCase()}
                                    </h3>
                                    <div className="inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-black/30 border border-white/5 text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-cyan-200/60 mb-1">
                                        {level.difficulty}
                                    </div>
                                </div>

                                {/* Bottom highlight */}
                                <div className={`absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            </button>
                        )
                    })}
                </div>

                {/* Footer Section */}
                <div className="mt-auto text-center py-4">
                    <p className="text-[10px] text-cyan-200/20 font-mono tracking-[0.5em]">
                        SELECT CARTRIDGE TO BOOT LEVEL
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LevelSelect;
