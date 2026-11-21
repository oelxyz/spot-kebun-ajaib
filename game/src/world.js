// world.js — builds the two panels' scenes from a level definition.
// Panel A renders the pristine scene; every difference is *baked* into
// panel B's own scene spec and palette copy, so both panels draw with the
// same pure routines and no restore gymnastics. Also resolves each
// difference's anchor (cx, cy, radius) for markers, hits and hints.

// deep-copy a scene spec so mutations never touch the shared level data
function cloneScene(scene) {
  const copy = {};
  for (const k of Object.keys(scene)) {
    const v = scene[k];
    copy[k] = Array.isArray(v) && Array.isArray(v[0]) ? v.map((e) => e.slice()) : v.slice();
  }
  return copy;
}

// Locate an element by target key in a scene spec. Returns {arr, idx, el}
// or null for named single elements handled by the caller.
function findElement(scene, key) {
  if (key.startsWith('flower')) {
    const idx = Number(key.slice(-1));
    return { arr: 'flowers', idx, el: scene.flowers[idx] };
  }
  if (key.startsWith('butterfly')) {
    const idx = Number(key.slice(-1));
    return { arr: 'butterflies', idx, el: scene.butterflies[idx] };
  }
  if (key.startsWith('mushroom')) {
    const idx = Number(key.slice(-1));
    return { arr: 'mushrooms', idx, el: scene.mushrooms[idx] };
  }
  if (key.startsWith('cloud')) {
    const idx = Number(key.slice(-1));
    return { arr: 'clouds', idx, el: scene.clouds[idx] };
  }
  return null;
}

const DIFF_ORDER = [
  (sceneB, paletteB, diff) => {  // 'color' — recolor an element
    const ref = findElement(sceneB, diff.target);
    if (ref) {
      if (typeof diff.delta === 'number' && diff.prop === 'colorIndex') {
        diff.cx = ref.el[0]; diff.cy = ref.el[1]; diff.radius = 26;
        ref.el[2] = (ref.el[2] + diff.delta) % 4;   // flowers: [x, y, colorIndex]
      } else if (typeof diff.delta === 'string' && diff.prop === 'color') {
        diff.cx = ref.el[0]; diff.cy = ref.el[1]; diff.radius = 28;
        paletteB.butterfly = diff.delta;            // butterflies share the palette colour
      }
    } else if (diff.target === 'pond' && typeof diff.delta === 'string') {
      diff.cx = sceneB.pond[0]; diff.cy = sceneB.pond[1]; diff.radius = 44;
      paletteB.pond = diff.delta; paletteB.pondDeep = diff.delta;
    } else if (diff.target === 'houseRoof' && typeof diff.delta === 'string') {
      diff.cx = sceneB.house[0]; diff.cy = sceneB.house[1] - 62; diff.radius = 34;
      paletteB.houseRoof = diff.delta;
    }
  },
  (sceneB, paletteB, diff) => {  // 'missing' / 'count' — element absent in B
    const ref = findElement(sceneB, diff.target);
    if (ref && ref.el) {
      diff.cx = ref.el[0]; diff.cy = ref.el[1];
      diff.radius = diff.target.startsWith('flower') ? 24 : 30;
      ref.el.__hidden = true;
    }
  },
  (sceneB, paletteB, diff) => {  // 'size' — scale / width change
    if (diff.target === 'pond') {
      diff.cx = sceneB.pond[0]; diff.cy = sceneB.pond[1]; diff.radius = 44;
      sceneB.pond[2] += diff.delta;               // pond w is index 2
      return;
    }
    const ref = findElement(sceneB, diff.target);
    if (ref && ref.el && diff.prop === 'scale') {
      ref.el[2] = Math.max(0.15, ref.el[2] + diff.delta);  // index 2 = scale for mushrooms/butterflies
      diff.cx = ref.el[0]; diff.cy = ref.el[1]; diff.radius = 30;
    }
  },
  (sceneB, paletteB, diff) => {  // 'moved' — position shift
    const ref = findElement(sceneB, diff.target);
    const el = ref && ref.el ? ref.el : (diff.target === 'pond' ? sceneB.pond : (diff.target === 'house' ? sceneB.house : null));
    if (!el) return;
    const axis = diff.prop === 'y' ? 1 : 0;
    el[axis] += diff.delta;
    diff.cx = el[0];
    diff.cy = axis === 0 ? el[1] : el[1] - diff.delta;  // anchor stays on the ORIGINAL spot
    diff.radius = 34;
  },
];

// Build both scenes, both palettes, and the resolved difference list.
export function buildWorld(level) {
  const sceneA = cloneScene(level.scene);
  const sceneB = cloneScene(level.scene);
  const paletteA = level.palette;
  const paletteB = { ...level.palette };
  const diffs = level.differences.map((d) => ({ ...d, found: false }));

  for (const diff of diffs) {
    if (diff.kind === 'color') DIFF_ORDER[0](sceneB, paletteB, diff);
    else if (diff.kind === 'missing' || diff.kind === 'count') DIFF_ORDER[1](sceneB, paletteB, diff);
    else if (diff.kind === 'size') DIFF_ORDER[2](sceneB, paletteB, diff);
    else if (diff.kind === 'moved') DIFF_ORDER[3](sceneB, paletteB, diff);
    if (diff.cy === undefined) { diff.cx = 0; diff.cy = 0; }
  }

  return { sceneA, sceneB, paletteA, paletteB, diffs };
}

// Does a click at (x, y) hit any unfound difference? Returns its index.
export function hitTest(diffs, x, y, slack = 16) {
  for (let i = 0; i < diffs.length; i++) {
    const d = diffs[i];
    if (d.found) continue;
    const dx = x - d.cx, dy = y - d.cy;
    if (dx * dx + dy * dy <= (d.radius + slack) * (d.radius + slack)) return i;
  }
  return -1;
}
