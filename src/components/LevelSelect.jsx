import React from 'react';
import { Lock, Star, ChevronLeft } from 'lucide-react';

const LevelSelect = ({ onSelectLevel, onBack, unlockedStage = 5 }) => {
    const levels = [
        { id: 1, name: 'Flat Desert', difficulty: 'Easy', color: 'from-orange-400 to-yellow-600' },
        { id: 2, name: 'Hill Climb', difficulty: 'Medium', color: 'from-green-500 to-emerald-700' },
        { id: 3, name: 'Canyon Jump', difficulty: 'Hard', color: 'from-red-500 to-orange-700' },
        { id: 4, name: 'Obstacle Course', difficulty: 'Very Hard', color: 'from-purple-500 to-indigo-700' },
        { id: 5, name: 'Extreme', difficulty: 'Insane', color: 'from-pink-500 to-rose-700' },
    ];

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-gray-900 text-white p-8">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>

            <div className="relative z-10 w-full max-w-4xl">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" /> Back to Menu
                </button>

                <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SELECT STAGE
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map((level) => {
                        const isLocked = level.id > unlockedStage;
                        return (
                            <button
                                key={level.id}
                                onClick={() => !isLocked && onSelectLevel(level.id)}
                                disabled={isLocked}
                                className={`group relative overflow-hidden rounded-2xl p-1 transition-all transform hover:scale-105 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-blue-500/20'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                <div className="bg-gray-800/90 backdrop-blur-xl relative h-full p-6 rounded-xl border border-white/10 flex flex-col items-center gap-4">

                                    {isLocked ? (
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                            <Lock className="w-8 h-8 text-gray-500" />
                                        </div>
                                    ) : (
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}>
                                            <span className="text-2xl font-bold text-white">{level.id}</span>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{level.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full border border-white/10 ${isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {level.difficulty}
                                        </span>
                                    </div>

                                    {!isLocked && (
                                        <div className="flex gap-1 mt-2">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <Star className="w-4 h-4 text-yellow-500/30" />
                                            <Star className="w-4 h-4 text-yellow-500/30" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default LevelSelect;
