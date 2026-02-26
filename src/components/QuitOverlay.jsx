import React from 'react';
import { LogOut, X } from 'lucide-react';

const QuitOverlay = ({ onConfirm, onCancel }) => {
    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>

            <div className="relative w-full max-w-xs mx-4">
                {/* Glow */}
                <div className="absolute -inset-1 rounded-3xl bg-red-800/20 blur-xl" />

                <div className="relative rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: 'linear-gradient(160deg, #130a0a 0%, #0c0808 100%)' }}>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                    <div className="p-7 text-center">
                        <div className="mb-4 inline-flex">
                            <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/25 flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-red-400" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-white mb-1 tracking-tight">ABORT MISSION?</h2>
                        <p className="text-red-300/50 mb-7 font-mono text-xs tracking-wider">All progress will be lost</p>

                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all tracking-wider">
                                <X className="w-4 h-4" /> CANCEL
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm text-white tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 4px 20px rgba(220,38,38,0.25)' }}>
                                <LogOut className="w-4 h-4" /> QUIT
                            </button>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default QuitOverlay;
