// main.js — game controller for Kebun Ajaib: wires the two panels, HUD,
// input, timer, hints, screens, and the ?shot= demo modes used for the
// entry's screenshots (start / play / end, all deterministic per seed).

import { LEVELS } from './levels.js';
import { buildWorld, hitTest } from './world.js';
import { drawPanel, drawHints, buildLogo } from './renderer.js';
import * as audio from './audio.js';

const cvL = document.getElementById('canvas-left');
const cvR = document.getElementById('canvas-right');
const ctxL = cvL.getContext('2d');
const ctxR = cvR.getContext('2d');
const W = cvL.width, H = cvL.height;

const els = {
  hud: document.getElementById('hud'),
  stage: document.getElementById('stage'),
  screenStart: document.getElementById('screen-start'),
  screenEnd: document.getElementById('screen-end'),
  hudLevel: document.getElementById('hud-level'),
  hudScore: document.getElementById('hud-score'),
  hudRemain: document.getElementById('hud-remain'),
  hudTime: document.getElementById('hud-time'),
  hudHints: document.getElementById('hud-hints'),
  btnHint: document.getElementById('btn-hint'),
  btnRestart: document.getElementById('btn-restart'),
  btnMute: document.getElementById('btn-mute'),
  btnStart: document.getElementById('btn-start'),
  btnNext: document.getElementById('btn-next'),
  btnAgain: document.getElementById('btn-again'),
  btnHome: document.getElementById('btn-home'),
  toast: document.getElementById('toast'),
  panels: document.getElementById('panels'),
  endTitle: document.getElementById('end-title'),
  endSub: document.getElementById('end-sub'),
  endScore: document.getElementById('end-score'),
  endTime: document.getElementById('end-time'),
  endHints: document.getElementById('end-hints'),
  endRank: document.getElementById('end-rank'),
  logoArt: document.getElementById('logo-art'),
};

// ---------- state ----------
const state = {
  levelIndex: 0,
  world: null,
  score: 0,
  timeLeft: 0,
  hintsLeft: 3,
  hintsUsed: 0,
  found: 0,
  playing: false,
  elapsed: 0,
  startedAt: 0,
  foundAt: [],
  hint: null,
  shakeUntil: 0,
  wrongFlashUntil: 0,
  toastUntil: 0,
  toastKind: '',
  toastText: '',
};

function toast(text, kind = 'info', ms = 1400) {
  state.toastText = text;
  state.toastKind = kind;
  state.toastUntil = state.elapsed + ms / 1000;
}

// ---------- setup ----------
function loadLevel(index, keepScore = false) {
  state.levelIndex = index % LEVELS.length;
  const level = LEVELS[state.levelIndex];
  state.world = buildWorld(level);
  state.score = keepScore ? state.score : 0;
  state.timeLeft = level.timeLimit;
  state.hintsLeft = 3;
  state.hintsUsed = 0;
  state.found = 0;
  state.foundAt = [];
  state.hint = null;
  state.playing = true;
  state.startedAt = state.elapsed;
  els.hudLevel.textContent = `Level ${level.id} · ${level.name}`;
  updateHud();
  showStage();
}

function updateHud() {
  const level = LEVELS[state.levelIndex];
  els.hudScore.textContent = state.score;
  const remain = state.world ? state.world.diffs.filter((d) => !d.found).length : 0;
  els.hudRemain.textContent = remain;
  els.hudTime.textContent = Math.ceil(state.timeLeft);
  els.hudTime.classList.toggle('warning', state.timeLeft <= 15);
  els.hudHints.textContent = state.hintsLeft;
  els.hudHints.classList.toggle('zero', state.hintsLeft === 0);
  els.btnHint.disabled = state.hintsLeft === 0 || !state.playing;
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function showStage() { show(els.hud); show(els.stage); hide(els.screenStart); hide(els.screenEnd); }
function showStart() { hide(els.hud); hide(els.stage); show(els.screenStart); hide(els.screenEnd); }
function showEnd(won) {
  show(els.hud); show(els.stage);   // keep the board visible with all markers stamped
  show(els.screenEnd);
  els.screenEnd.classList.add('overlay');
  const level = LEVELS[state.levelIndex];
  els.endTitle.textContent = won ? 'Kebun Selesai! ✿' : 'Waktu Habis…';
  els.endSub.textContent = won
    ? `Kamu menemukan semua ${state.world.diffs.length} perbedaan di ${level.name}.`
    : `Kamu menemukan ${state.found} dari ${state.world.diffs.length} perbedaan di ${level.name}.`;
  els.endScore.textContent = state.score;
  const used = Math.max(0, state.elapsed - state.startedAt - state.timeLeft);
  els.endTime.textContent = `${Math.floor(used / 60)}:${String(Math.floor(used % 60)).padStart(2, '0')}`;
  els.endHints.textContent = state.hintsUsed;
  els.endRank.textContent = won
    ? (state.hintsUsed === 0 ? '★★★' : state.hintsUsed <= 1 ? '★★' : '★')
    : '—';
  els.btnNext.disabled = state.levelIndex >= LEVELS.length - 1;
  els.btnNext.textContent = state.levelIndex >= LEVELS.length - 1 ? '✓ Semua Level Selesai' : '▶ Level Berikutnya';
}

// ---------- input ----------
function panelFromEvent(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (W / rect.width);
  const y = (e.clientY - rect.top) * (H / rect.height);
  return { x, y };
}

function onClickPanel(e) {
  if (!state.playing) return;
  const { x, y } = panelFromEvent(e);
  const idx = hitTest(state.world.diffs, x, y);
  if (idx >= 0) {
    const d = state.world.diffs[idx];
    d.found = true;
    state.found++;
    state.score += 100;
    state.foundAt.push(state.elapsed);
    audio.sfxFound(state.found);
    toast(d.kind === 'count' ? 'Satu benda hilang! +100' : 'Ketemu! +100', 'good');
    els.panels.classList.add('found-flash');
    setTimeout(() => els.panels.classList.remove('found-flash'), 480);
    updateHud();
    if (state.found === state.world.diffs.length) {
      state.playing = false;
      audio.sfxWin();
      setTimeout(() => showEnd(true), 900);
    }
  } else {
    state.score = Math.max(0, state.score - 30);
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    audio.sfxWrong();
    toast('Salah! −5 detik', 'bad', 1100);
    els.panels.classList.add('shake');
    state.wrongFlashUntil = state.elapsed + 0.4;
    setTimeout(() => els.panels.classList.remove('shake'), 380);
    updateHud();
    if (state.timeLeft <= 0) {
      state.playing = false;
      audio.sfxLose();
      setTimeout(() => showEnd(false), 700);
    }
  }
}

function useHint() {
  if (!state.playing || state.hintsLeft <= 0) return;
  const remaining = state.world.diffs.filter((d) => !d.found);
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft--;
  state.hintsUsed++;
  state.hint = { cx: pick.cx, cy: pick.cy, start: state.elapsed };
  audio.sfxHint();
  toast('✨ Perhatikan lingkaran berkedip!', 'info');
  updateHud();
}

function restart() {
  audio.sfxClick();
  loadLevel(state.levelIndex);
}

cvL.addEventListener('pointerdown', onClickPanel);
cvR.addEventListener('pointerdown', onClickPanel);
els.btnHint.addEventListener('click', useHint);
els.btnRestart.addEventListener('click', restart);
els.btnMute.addEventListener('click', () => {
  const m = !audio.isMuted();
  audio.setMuted(m);
  els.btnMute.textContent = m ? '🔇 Senyap' : '🔊 Suara';
});
els.btnStart.addEventListener('click', () => { audio.sfxClick(); loadLevel(state.levelIndex); });
document.querySelectorAll('.level-btn').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.level-btn').forEach((x) => x.classList.remove('selected'));
    b.classList.add('selected');
    state.levelIndex = Number(b.dataset.level) - 1;
    audio.sfxClick();
  });
});
document.querySelector('.level-btn').classList.add('selected');
els.btnNext.addEventListener('click', () => { audio.sfxClick(); loadLevel(state.levelIndex + 1, true); });
els.btnAgain.addEventListener('click', () => { audio.sfxClick(); loadLevel(state.levelIndex, true); });
els.btnHome.addEventListener('click', () => { audio.sfxClick(); showStart(); });

document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k >= '1' && k <= '3' && !els.screenStart.classList.contains('hidden')) {
    const btn = document.querySelector(`.level-btn[data-level="${k}"]`);
    if (btn) btn.click();
  } else if (k === 'h') useHint();
  else if (k === 'r') { if (state.world) restart(); }
  else if (k === 'm') els.btnMute.click();
});

// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  state.elapsed += dt;

  if (state.world) {
    if (state.playing) {
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        state.playing = false;
        audio.sfxLose();
        setTimeout(() => showEnd(false), 500);
      }
      updateHud();
    }
    const markers = state.world.diffs.filter((d) => d.found)
      .map((d) => ({ cx: d.cx, cy: d.cy, fresh: null }));
    const lastFound = state.foundAt[state.foundAt.length - 1];
    if (lastFound !== undefined && state.elapsed - lastFound < 0.6 && markers.length) {
      markers[markers.length - 1].fresh = state.elapsed - (state.elapsed - lastFound);
    }
    drawPanel(ctxL, W, H, state.world.paletteA, state.world.sceneA, markers, state.elapsed);
    drawPanel(ctxR, W, H, state.world.paletteB, state.world.sceneB, markers, state.elapsed);
    if (state.hint && state.elapsed - state.hint.start < 2.4) {
      drawHints(ctxL, state.hint);
      drawHints(ctxR, state.hint);
    } else if (state.hint) state.hint = null;
    // toast
    if (state.elapsed < state.toastUntil) {
      els.toast.textContent = state.toastText;
      els.toast.className = state.toastKind;
    } else {
      els.toast.className = 'hidden';
    }
  }
  requestAnimationFrame(frame);
}

// ---------- screenshot demo modes ----------
// ?shot=start|play|end&seed=1 — deterministic views for the entry shots.
function applyShotMode(params) {
  const shot = params.get('shot');
  if (!shot) return;
  const levelIndex = Math.min(LEVELS.length - 1, Math.max(0, Number(params.get('level') ?? 1) - 1));

  if (shot === 'start') {
    showStart();
    return;
  }

  loadLevel(levelIndex);
  const diffs = state.world.diffs;

  if (shot === 'play') {
    // place markers deterministically on the first half of the differences
    const howMany = Math.max(1, Math.floor(diffs.length / 2));
    for (let i = 0; i < howMany; i++) diffs[i].found = true;
    state.found = howMany;
    state.score = 100 * howMany;
    state.foundAt = diffs.slice(0, howMany).map((_, i) => state.elapsed - (howMany - i) * 0.8);
    state.timeLeft = LEVELS[levelIndex].timeLimit * 0.62;
    state.elapsed += 0; // keep animations gentle
    updateHud();
    return;
  }

  if (shot === 'end') {
    for (const d of diffs) d.found = true;
    state.found = diffs.length;
    state.score = 100 * diffs.length + 250;   // bonus for a clean sweep
    state.playing = false;
    updateHud();
    showEnd(true);
  }
}

// ---------- boot ----------
els.logoArt.innerHTML = buildLogo();
const params = new URLSearchParams(location.search);
applyShotMode(params);
requestAnimationFrame(frame);
