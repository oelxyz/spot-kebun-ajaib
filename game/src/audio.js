// audio.js — all game sound is synthesized at runtime with WebAudio:
// no audio files, no network. A shared AudioContext lazily wakes on the
// first user gesture. Every call builds its own oscillator chain.

let ctx = null;
let muted = false;
let master = null;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type = 'sine', gain = 0.5, when = 0, slideTo = null) {
  const ac = ensure();
  if (!ac || muted) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// rising sparkle chime when a difference is found
export function sfxFound(step = 0) {
  const base = 620 * Math.pow(1.06, step);
  tone(base, 0.18, 'triangle', 0.45);
  tone(base * 1.5, 0.22, 'sine', 0.3, 0.07);
  tone(base * 2, 0.3, 'sine', 0.22, 0.14);
}

// dull descending buzz on a wrong click
export function sfxWrong() {
  tone(180, 0.22, 'sawtooth', 0.3, 0, 90);
}

// soft two-note cue when a hint is used
export function sfxHint() {
  tone(520, 0.14, 'sine', 0.35);
  tone(780, 0.2, 'sine', 0.3, 0.1);
}

// victory arpeggio on level completion
export function sfxWin() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((n, i) => tone(n, 0.35, 'triangle', 0.4, i * 0.12));
  tone(261, 0.9, 'sine', 0.25, 0.1);
}

// game-over descending phrase
export function sfxLose() {
  [440, 349, 262, 196].forEach((n, i) => tone(n, 0.4, 'triangle', 0.35, i * 0.18));
}

// click tick for UI buttons
export function sfxClick() {
  tone(880, 0.05, 'square', 0.15);
}

export function setMuted(v) {
  muted = v;
  if (master) master.gain.value = v ? 0 : 0.35;
}

export function isMuted() {
  return muted;
}
