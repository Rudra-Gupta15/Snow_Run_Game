import React from 'react';

const QuitOverlay = ({ onConfirm, onCancel }) => {
    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm p-8 bg-red-950/40 rounded-2xl border border-red-500/30 text-center shadow-[0_0_50px_rgba(255,0,0,0.1)]">
                <h2 className="text-2xl font-black text-white mb-2 tracking-wider">ABORT MISSION?</h2>
                <p className="text-red-200/70 mb-8 font-mono text-sm">Are you sure you want to quit?</p>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-white/10"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-red-500/20"
                    >
                        QUIT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuitOverlay;
