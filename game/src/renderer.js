// renderer.js — draws each panel (scene + markers + hint pulse) and the
// little SVG logo on the start screen. Both panels share one draw routine;
// the found marker is a ring pair stamped on BOTH panels at the same spot.

import { drawScene } from './scenery.js';

export function drawPanel(ctx, W, H, palette, scene, markers, t) {
  drawScene(ctx, W, H, palette, scene, t);

  for (const m of markers) {
    drawMarker(ctx, m.cx, m.cy, m.fresh, t);
  }
}

function drawMarker(ctx, cx, cy, fresh, t) {
  const pop = fresh ? 1 + Math.sin(Math.min((t - fresh) * 6, Math.PI)) * 0.25 : 1;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pop, pop);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 29, 0, Math.PI * 2);
  ctx.stroke();
  // sparkles
  ctx.fillStyle = 'rgba(255,209,102,0.9)';
  for (let i = 0; i < 4; i++) {
    const a = t * 1.5 + i * Math.PI / 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 34, Math.sin(a) * 34, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHintRing(ctx, cx, cy, t) {
  const r = 40 + Math.sin(t * 5) * 6;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,143,171,0.9)';
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 7]);
  ctx.lineDashOffset = -t * 30;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawHints(ctx, hint) {
  if (!hint) return;
  drawHintRing(ctx, hint.cx, hint.cy, hint.start);
}

// Decorative SVG logo for the start screen: a mushroom house, a butterfly
// and flowers in a ring — all inline, no assets.
export function buildLogo() {
  const svg = `
<svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3e2a6b"/>
      <stop offset="1" stop-color="#ff9e7d"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="220" height="120" rx="16" fill="url(#lg-sky)"/>
  <circle cx="170" cy="34" r="16" fill="#ffd166" opacity="0.9"/>
  <ellipse cx="60" cy="104" rx="80" ry="18" fill="#2d6a4f"/>
  <rect x="52" y="62" width="26" height="34" rx="6" fill="#f4e3d3"/>
  <path d="M42 66 Q65 30 88 66 Z" fill="#e76f51"/>
  <circle cx="58" cy="52" r="4" fill="#fff1e6"/>
  <circle cx="72" cy="58" r="3" fill="#fff1e6"/>
  <ellipse cx="130" cy="46" rx="9" ry="12" fill="#ff8fab" transform="rotate(-30 130 46)"/>
  <ellipse cx="146" cy="46" rx="9" ry="12" fill="#ff8fab" transform="rotate(30 146 46)"/>
  <rect x="135" y="38" width="4" height="16" rx="2" fill="#4a3728"/>
  <path d="M105 100 q3 -14 0 -22" stroke="#3a9e5f" stroke-width="2.5" fill="none"/>
  <circle cx="105" cy="74" r="7" fill="#ffd166"/>
  <circle cx="99" cy="70" r="4" fill="#ff8fab"/>
  <circle cx="111" cy="70" r="4" fill="#ff8fab"/>
  <path d="M45 100 q3 -12 0 -20" stroke="#3a9e5f" stroke-width="2.5" fill="none"/>
  <circle cx="45" cy="76" r="6" fill="#b388eb"/>
  <path d="M175 98 q3 -12 0 -20" stroke="#3a9e5f" stroke-width="2.5" fill="none"/>
  <circle cx="175" cy="74" r="6" fill="#4dd4ac"/>
</svg>`;
  return svg;
}
