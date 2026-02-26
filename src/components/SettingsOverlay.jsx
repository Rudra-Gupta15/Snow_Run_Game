import React, { useState } from 'react';
import { X, Volume2, Music, Mic } from 'lucide-react';

const SettingsOverlay = ({ onClose }) => {
    const [volume, setVolume] = useState(80);
    const [music, setMusic] = useState(true);
    const [sfx, setSfx] = useState(true);

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md mx-4 p-6 md:p-8 bg-slate-900/90 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,255,0.2)]">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-cyan-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-8 italic tracking-wider">
                    SETTINGS
                </h2>

                <div className="space-y-6">
                    {/* Master Volume */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-cyan-100">
                            <div className="flex items-center gap-2">
                                <Volume2 className="w-5 h-5" />
                                <span className="font-bold tracking-wider">MASTER VOLUME</span>
                            </div>
                            <span className="font-mono text-cyan-400">{volume}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                        />
                    </div>

                    {/* Music Toggle */}
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3 text-cyan-100">
                            <Music className="w-5 h-5" />
                            <span className="font-bold tracking-wider">MUSIC</span>
                        </div>
                        <button
                            onClick={() => setMusic(!music)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${music ? 'bg-cyan-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${music ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* SFX Toggle */}
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center gap-3 text-cyan-100">
                            <Mic className="w-5 h-5" />
                            <span className="font-bold tracking-wider">SFX</span>
                        </div>
                        <button
                            onClick={() => setSfx(!sfx)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${sfx ? 'bg-cyan-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${sfx ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 tracking-wider"
                >
                    SAVE & CLOSE
                </button>
            </div>
        </div>
    );
};

export default SettingsOverlay;
