/**
 * soundManager.js — Web Audio API procedural sound effects
 * No audio files needed. All sounds generated synthetically.
 */

let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume suspended context (browser autoplay policy)
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

/** Play a short tone burst */
function playTone(freq, type, duration, volume, decay, delayMs = 0) {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delayMs / 1000);
        gain.gain.setValueAtTime(volume, ctx.currentTime + delayMs / 1000);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delayMs / 1000 + duration);
        osc.start(ctx.currentTime + delayMs / 1000);
        osc.stop(ctx.currentTime + delayMs / 1000 + duration + 0.05);
    } catch (e) { /* ignore */ }
}

/** Noise burst for crash/explosion */
function playNoise(duration, volume, hiPassFreq = 1000) {
    try {
        const ctx = getCtx();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = hiPassFreq;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        source.stop(ctx.currentTime + duration + 0.05);
    } catch (e) { /* ignore */ }
}

export const SFX = {
    /** Bike jump — quick rising tone */
    jump() {
        playTone(220, 'square', 0.08, 0.18, 0.08);
        playTone(440, 'sine', 0.15, 0.12, 0.15, 60);
        playTone(660, 'sine', 0.12, 0.08, 0.12, 110);
    },

    /** Double jump — higher pitch sweep */
    doubleJump() {
        playTone(330, 'triangle', 0.07, 0.15, 0.07);
        playTone(660, 'sine', 0.12, 0.12, 0.12, 50);
        playTone(990, 'sine', 0.1, 0.08, 0.1, 100);
    },

    /** Boost activate — whoosh + engine roar */
    boost() {
        playTone(80, 'sawtooth', 0.25, 0.22, 0.25);
        playTone(160, 'sawtooth', 0.2, 0.15, 0.2, 30);
        playNoise(0.18, 0.08, 2000);
    },

    /** Crash / game over */
    crash() {
        playNoise(0.5, 0.4, 200);
        playTone(80, 'sawtooth', 0.4, 0.3, 0.4);
        playTone(55, 'square', 0.35, 0.25, 0.35, 100);
        playTone(40, 'sine', 0.5, 0.2, 0.5, 200);
    },

    /** Landing on ground */
    land() {
        playTone(110, 'sine', 0.1, 0.12, 0.1);
        playNoise(0.08, 0.06, 500);
    },

    /** Ice particle / sparkle */
    sparkle() {
        const freqs = [880, 1320, 1760];
        freqs.forEach((f, i) => playTone(f, 'sine', 0.08, 0.05, 0.08, i * 30));
    },

    /** Score / checkpoint */
    score() {
        [523, 659, 784].forEach((f, i) => playTone(f, 'triangle', 0.12, 0.1, 0.12, i * 80));
    },

    /** Level complete jingle */
    levelComplete() {
        const melody = [
            [523, 0], [659, 120], [784, 240], [1047, 360], [784, 520], [1047, 640]
        ];
        melody.forEach(([f, t]) => playTone(f, 'triangle', 0.2, 0.15, 0.2, t));
    },

    /** Game over stinger */
    gameOver() {
        const notes = [[440, 0], [330, 250], [220, 500], [165, 800]];
        notes.forEach(([f, t]) => playTone(f, 'square', 0.3, 0.18, 0.3, t));
    },

    /** Enemy bear growl */
    bearGrowl() {
        playTone(60, 'sawtooth', 0.3, 0.15, 0.3);
        playTone(80, 'square', 0.25, 0.1, 0.25, 50);
    },

    /** Boss hit */
    bossHit() {
        playNoise(0.1, 0.2, 800);
        playTone(220, 'square', 0.1, 0.15, 0.1, 20);
    },

    /** Menu click/hover */
    click() {
        playTone(800, 'sine', 0.06, 0.1, 0.06);
    },
};

export default SFX;
