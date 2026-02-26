import React, { useState } from 'react';
import { X, Volume2, Music, Mic, Check } from 'lucide-react';

const Toggle = ({ value, onChange }) => (
    <button
        onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
        style={{ background: value ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : 'rgba(255,255,255,0.08)', boxShadow: value ? '0 0 12px rgba(6,182,212,0.4)' : 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const SettingsOverlay = ({ onClose }) => {
    const [volume, setVolume] = useState(80);
    const [music, setMusic] = useState(true);
    const [sfx, setSfx] = useState(true);

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}>

            <div className="relative w-full max-w-sm mx-4">
                {/* Halo */}
                <div className="absolute -inset-2 rounded-3xl bg-cyan-500/10 blur-2xl" />

                <div className="relative rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: 'linear-gradient(160deg, #081828 0%, #050d1a 100%)' }}>

                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-7 pt-6 pb-2">
                        <div>
                            <div className="text-[9px] text-cyan-500/60 font-bold tracking-[0.4em] uppercase">// SYSTEM</div>
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 italic tracking-tight">
                                SETTINGS
                            </h2>
                        </div>
                        <button onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/8">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="px-7 pb-7 space-y-4 mt-4">
                        {/* Master Volume */}
                        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-cyan-100">
                                    <Volume2 className="w-4 h-4 text-cyan-400" />
                                    <span className="font-bold text-sm tracking-wider">MASTER VOLUME</span>
                                </div>
                                <span className="font-mono text-cyan-400 font-bold text-sm w-10 text-right">{volume}%</span>
                            </div>
                            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="absolute h-full rounded-full transition-all duration-100"
                                    style={{ width: `${volume}%`, background: 'linear-gradient(90deg, #0891b2, #2563eb)', boxShadow: '0 0 8px rgba(8,145,178,0.6)' }} />
                            </div>
                            <input type="range" min="0" max="100" value={volume}
                                onChange={e => setVolume(e.target.value)}
                                className="w-full mt-2 opacity-0 absolute cursor-pointer" style={{ height: '16px', marginTop: '-16px' }} />
                            <input type="range" min="0" max="100" value={volume}
                                onChange={e => setVolume(e.target.value)}
                                className="w-full h-2 opacity-0 cursor-pointer relative"
                                style={{ marginTop: '-0.5rem' }} />
                        </div>

                        {/* Music */}
                        <div className="flex items-center justify-between rounded-2xl p-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 flex items-center justify-center border border-cyan-500/20">
                                    <Music className="w-4 h-4 text-cyan-400" />
                                </div>
                                <span className="font-bold text-sm text-cyan-50 tracking-wider">MUSIC</span>
                            </div>
                            <Toggle value={music} onChange={setMusic} />
                        </div>

                        {/* SFX */}
                        <div className="flex items-center justify-between rounded-2xl p-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 flex items-center justify-center border border-cyan-500/20">
                                    <Mic className="w-4 h-4 text-cyan-400" />
                                </div>
                                <span className="font-bold text-sm text-cyan-50 tracking-wider">SOUND FX</span>
                            </div>
                            <Toggle value={sfx} onChange={setSfx} />
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <button onClick={onClose}
                            className="group w-full py-3.5 rounded-xl font-black text-sm text-white tracking-[0.15em] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #0891b2, #1d4ed8)', boxShadow: '0 4px 20px rgba(8,145,178,0.3)' }}>
                            <Check className="w-4 h-4" />
                            SAVE & CLOSE
                        </button>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default SettingsOverlay;
