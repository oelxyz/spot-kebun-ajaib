// scenery.js — pure drawing routines for every element of a Kebun Ajaib scene.
// Each draw takes (ctx, spec, palette, time) so panels can animate subtly.
// All shapes are hand-drawn with paths: no images, no external assets.

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCloud(ctx, x, y, s, palette, t) {
  const drift = Math.sin(t * 0.25 + x * 0.05) * 4 * s;
  ctx.save();
  ctx.translate(x + drift, y);
  ctx.scale(s, s);
  ctx.fillStyle = palette.cloud;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.arc(24, -8, 17, 0, Math.PI * 2);
  ctx.arc(-22, -6, 15, 0, Math.PI * 2);
  ctx.arc(8, -14, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHill(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI, 0);
  ctx.fill();
}

function drawPond(ctx, x, y, w, h, palette, t) {
  const cx = x, cy = y;
  ctx.save();
  ctx.translate(cx, cy);
  const grad = ctx.createRadialGradient(0, -h * 0.2, 8, 0, 0, w * 0.8);
  grad.addColorStop(0, palette.pond);
  grad.addColorStop(1, palette.pondDeep);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // ripples
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 3; i++) {
    const rr = 8 + i * 11 + Math.sin(t * 2 + i) * 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, rr * 1.5, rr * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // a lily pad
  ctx.fillStyle = '#3a9e5f';
  ctx.beginPath();
  ctx.ellipse(-w * 0.22, h * 0.1, 12, 7, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff8fab';
  ctx.beginPath();
  ctx.arc(-w * 0.22, h * 0.06, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTree(ctx, x, y, s, palette, t) {
  const sway = Math.sin(t * 1.4 + x) * 2.5 * s;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = palette.trunk;
  roundRect(ctx, -9, -90, 18, 92, 5);
  ctx.fill();
  ctx.fillStyle = palette.leaf;
  ctx.beginPath();
  ctx.arc(sway, -110, 44, 0, Math.PI * 2);
  ctx.arc(-30 + sway, -92, 30, 0, Math.PI * 2);
  ctx.arc(30 + sway, -92, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.leaf2;
  ctx.beginPath();
  ctx.arc(sway + 8, -118, 22, 0, Math.PI * 2);
  ctx.fill();
  // fruit dots
  ctx.fillStyle = '#ffd166';
  ctx.beginPath(); ctx.arc(-18 + sway, -108, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20 + sway, -95, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawMushroom(ctx, x, y, s, palette) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = palette.mushroomStem;
  roundRect(ctx, -7, -30, 14, 30, 5);
  ctx.fill();
  ctx.fillStyle = palette.mushroom;
  ctx.beginPath();
  ctx.arc(0, -30, 20, Math.PI, 0);
  ctx.quadraticCurveTo(20, -22, 0, -22);
  ctx.quadraticCurveTo(-20, -22, -20, -30);
  ctx.fill();
  ctx.fillStyle = palette.mushroomDot;
  ctx.beginPath(); ctx.arc(-8, -34, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -40, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(11, -31, 2.2, 0, Math.PI * 2); ctx.fill();
  // sleepy eyes on stem
  ctx.strokeStyle = 'rgba(60,40,30,0.6)';
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(-3, -14, 2.2, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(4, -14, 2.2, 0, Math.PI); ctx.stroke();
  ctx.restore();
}

function drawHouse(ctx, x, y, s, palette) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = palette.house;
  roundRect(ctx, -26, -46, 52, 46, 6);
  ctx.fill();
  ctx.fillStyle = palette.houseRoof;
  ctx.beginPath();
  ctx.moveTo(-34, -44);
  ctx.quadraticCurveTo(0, -84, 34, -44);
  ctx.closePath();
  ctx.fill();
  // door
  ctx.fillStyle = 'rgba(40,25,20,0.85)';
  roundRect(ctx, -8, -24, 16, 24, 4);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(4, -12, 2, 0, Math.PI * 2);
  ctx.fill();
  // window
  ctx.fillStyle = 'rgba(255,241,184,0.9)';
  ctx.beginPath();
  ctx.arc(-14, -34, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx, x, y, s, color, t) {
  const sway = Math.sin(t * 1.8 + x * 0.1) * 2;
  ctx.save();
  ctx.translate(x + sway, y);
  ctx.scale(s, s);
  ctx.strokeStyle = '#3a9e5f';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(2, -12, 0, -22);
  ctx.stroke();
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + t * 0.3;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 7, -22 + Math.sin(a) * 7, 6, 3.6, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath();
  ctx.arc(0, -22, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawButterfly(ctx, x, y, s, color, t, phase) {
  const flap = Math.sin(t * 7 + phase) * 0.7;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.rotate(Math.sin(t * 1.2 + phase) * 0.15);
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.rotate(dir * flap * 0.5);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(dir * 7, -3, 7, 10, dir * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(dir * 5, 5, 5, 7, dir * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(dir * 7, -4, 2.6, 4, dir * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#4a3728';
  roundRect(ctx, -1.6, -9, 3.2, 18, 2);
  ctx.fill();
  ctx.strokeStyle = '#4a3728';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(-3, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(3, -14); ctx.stroke();
  ctx.restore();
}

function drawFirefly(ctx, x, y, t, i) {
  const glow = 0.45 + Math.sin(t * 2.4 + i * 1.7) * 0.4;
  const fy = y + Math.sin(t * 1.5 + i) * 6;
  const fx = x + Math.cos(t * 1.1 + i * 2) * 8;
  ctx.save();
  const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, 10);
  g.addColorStop(0, `rgba(255,241,150,${glow})`);
  g.addColorStop(1, 'rgba(255,241,150,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(fx, fy, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,255,220,${Math.min(1, glow + 0.3)})`;
  ctx.beginPath();
  ctx.arc(fx, fy, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSun(ctx, x, y, r, palette, t) {
  ctx.save();
  const pulse = 1 + Math.sin(t * 1.2) * 0.04;
  const g = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 2.1 * pulse);
  g.addColorStop(0, palette.sunGlow);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.1 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.sun;
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// drawScene paints a complete panel. Named elements are labelled so
// world.js can move/scale/hide/recolor them per the level's differences.
export function drawScene(ctx, W, H, palette, scene, t) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, palette.skyTop);
  sky.addColorStop(0.55, palette.skyMid);
  sky.addColorStop(1, palette.skyBot);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // stars (top corners) — fixed decorative dots
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  const stars = [[40, 40], [95, 68], [210, 34], [340, 52], [470, 36], [610, 70], [700, 40], [520, 58]];
  for (const [sx, sy] of stars) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSun(ctx, scene.sun[0], scene.sun[1], scene.sun[2], palette, t);

  scene.clouds.forEach(([x, y, s], i) => { if (!scene.clouds[i].__hidden) drawCloud(ctx, x, y, s, palette, t + i); });
  scene.hills.forEach(([x, y, r], i) => drawHill(ctx, x, y, r, i === 0 ? palette.hill1 : palette.hill2));

  drawPond(ctx, scene.pond[0], scene.pond[1], scene.pond[2], scene.pond[3], palette, t);
  drawTree(ctx, scene.tree[0], scene.tree[1], scene.tree[2], palette, t);
  drawHouse(ctx, scene.house[0], scene.house[1], scene.house[2], palette);

  scene.mushrooms.forEach((m) => { if (m && !m.__hidden) drawMushroom(ctx, m[0], m[1], m[2], palette); });
  scene.flowers.forEach((f, i) => {
    if (f.__hidden) return;
    drawFlower(ctx, f[0], f[1], 1.0, palette.flower[f[2] % palette.flower.length], t + i);
  });
  scene.butterflies.forEach((b) => {
    if (b.__hidden) return;
    drawButterfly(ctx, b[0], b[1], b[2], palette.butterfly, t, b[3]);
  });
  scene.fireflies.forEach(([x, y], i) => drawFirefly(ctx, x, y, t, i));

  // ground band
  ctx.fillStyle = palette.ground;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H - 36);
  ctx.quadraticCurveTo(W / 2, H - 52, W, H - 36);
  ctx.lineTo(W, H);
  ctx.fill();
}

// Named element lookup used by world.js to build the altered panel B.
// Returns per-key {base} plus a mutate closure applied to draw calls.
export function elementTable(scene) {
  return {
    sun: { get: () => scene.sun, x: 0, y: 1 },
    cloud0: { idx: 0, arr: 'clouds' },
    cloud1: { idx: 1, arr: 'clouds' },
    cloud2: { idx: 2, arr: 'clouds' },
    pond: { get: () => scene.pond, x: 0, y: 1, w: 2, h: 3 },
    tree: { get: () => scene.tree, x: 0, y: 1, scale: 2 },
    house: { get: () => scene.house, x: 0, y: 1, scale: 2 },
    mushroom0: { idx: 0, arr: 'mushrooms', x: 0, y: 1, scale: 2 },
    mushroom1: { idx: 1, arr: 'mushrooms', x: 0, y: 1, scale: 2 },
    mushroom2: { idx: 2, arr: 'mushrooms', x: 0, y: 1, scale: 2 },
    mushroom3: { idx: 3, arr: 'mushrooms', x: 0, y: 1, scale: 2 },
    flower0: { idx: 0, arr: 'flowers' },
    flower1: { idx: 1, arr: 'flowers' },
    flower2: { idx: 2, arr: 'flowers' },
    flower3: { idx: 3, arr: 'flowers' },
    flower4: { idx: 4, arr: 'flowers' },
    flower5: { idx: 5, arr: 'flowers' },
    flower6: { idx: 6, arr: 'flowers' },
    flower7: { idx: 7, arr: 'flowers' },
    butterfly0: { idx: 0, arr: 'butterflies' },
    butterfly1: { idx: 1, arr: 'butterflies' },
    butterfly2: { idx: 2, arr: 'butterflies' },
    butterfly3: { idx: 3, arr: 'butterflies' },
  };
}
