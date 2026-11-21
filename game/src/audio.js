// Bunyi permainan lewat WebAudio, tanpa file suara.
let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, duration, type, volume) {
  const ctx = ensureCtx();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

export function playFoundSound() {
  tone(660, 0, 0.14, 'sine', 0.25);
  tone(880, 0.09, 0.2, 'sine', 0.25);
}

export function playWrongSound() {
  tone(160, 0, 0.18, 'sawtooth', 0.15);
}

export function playHintSound() {
  tone(520, 0, 0.12, 'triangle', 0.2);
  tone(780, 0.1, 0.16, 'triangle', 0.2);
}

export function playWinSound() {
  tone(523, 0, 0.16, 'sine', 0.25);
  tone(659, 0.12, 0.16, 'sine', 0.25);
  tone(784, 0.24, 0.16, 'sine', 0.25);
  tone(1047, 0.36, 0.3, 'sine', 0.25);
}

export function playClickSound() {
  tone(440, 0, 0.06, 'sine', 0.12);
}
