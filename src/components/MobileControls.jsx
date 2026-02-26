import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Zap } from 'lucide-react';

const MobileControls = ({ onAction }) => {
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const joystickRef = useRef(null);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleStart = (e) => {
        isDragging.current = true;
        handleMove(e);
    };

    const handleMove = (e) => {
        if (!isDragging.current || !containerRef.current) return;

        const touch = e.touches ? e.touches[0] : e;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = rect.width / 2;

        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        setJoystickPos({ x: dx, y: dy });

        // Map to movement
        const normalizedX = dx / maxRadius;
        onAction('move', normalizedX);
    };

    const handleEnd = () => {
        isDragging.current = false;
        setJoystickPos({ x: 0, y: 0 });
        onAction('move', 0);
    };

    useEffect(() => {
        const moveHandler = (e) => handleMove(e);
        const endHandler = () => handleEnd();

        window.addEventListener('touchmove', moveHandler, { passive: false });
        window.addEventListener('touchend', endHandler);
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', endHandler);

        return () => {
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', endHandler);
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', endHandler);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-end justify-between md:hidden"
            style={{ padding: 'env(safe-area-inset-top, 16px) env(safe-area-inset-right, 20px) max(env(safe-area-inset-bottom, 16px), 20px) env(safe-area-inset-left, 20px)' }}>
            {/* Left: Joystick */}
            <div
                ref={containerRef}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10 relative pointer-events-auto touch-none shadow-2xl overflow-visible"
                onTouchStart={handleStart}
                onMouseDown={handleStart}
            >
                <div
                    ref={joystickRef}
                    className="absolute w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 pointer-events-none"
                    style={{
                        left: `calc(50% + ${joystickPos.x}px)`,
                        top: `calc(50% + ${joystickPos.y}px)`
                    }}
                />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Right: Actions */}
            <div className="flex gap-4 items-end pointer-events-auto">
                {/* Boost Button */}
                <button
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 active:bg-cyan-500/20 transition-all shadow-xl group"
                    onTouchStart={() => onAction('boost', true)}
                    onTouchEnd={() => onAction('boost', false)}
                    onMouseDown={() => onAction('boost', true)}
                    onMouseUp={() => onAction('boost', false)}
                >
                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 group-active:text-white transition-colors" />
                </button>

                {/* Jump Button */}
                <button
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center active:scale-90 active:bg-blue-500/40 transition-all shadow-2xl group"
                    onTouchStart={() => onAction('jump', true)}
                    onTouchEnd={() => onAction('jump', false)}
                    onMouseDown={() => onAction('jump', true)}
                    onMouseUp={() => onAction('jump', false)}
                >
                    <ArrowUp className="w-8 h-8 md:w-10 md:h-10 text-white group-active:scale-125 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default MobileControls;
