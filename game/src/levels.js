// levels.js — three handcrafted Kebun Ajaib scenes.
// Each level defines a background palette, the scenery elements drawn by
// scenery.js, and the list of differences (in the RIGHT panel) relative to
// the LEFT panel. Every difference is {kind, target, prop?, delta?} applied
// by world.js when building panel B's scene.

export const LEVELS = [
  {
    id: 1,
    name: 'Taman Senja',
    timeLimit: 120,
    palette: {
      skyTop: '#ff9e7d', skyMid: '#ffd6a5', skyBot: '#fff3c4',
      sun: '#ff6f91', sunGlow: 'rgba(255,111,145,0.35)',
      hill1: '#95d5b2', hill2: '#6fbf8f', ground: '#52b788',
      pond: '#57a0d3', pondDeep: '#3b7bb8',
      trunk: '#7f5539', leaf: '#2d6a4f', leaf2: '#40916c',
      mushroom: '#e76f51', mushroomDot: '#fff1e6', mushroomStem: '#f4e3d3',
      flower: ['#ff8fab', '#ffd166', '#b388eb', '#4dd4ac'],
      butterfly: '#f4a261', house: '#c56cf0', houseRoof: '#6c5ce7',
      cloud: 'rgba(255,255,255,0.85)',
    },
    scene: {
      sun: [640, 92, 54],
      clouds: [[140, 80, 1.0], [420, 130, 0.8], [600, 60, 0.7]],
      hills: [[150, 470, 190], [520, 490, 240]],
      pond: [400, 468, 120, 56],
      tree: [130, 400, 1.0],
      mushrooms: [[300, 470, 1.0], [610, 430, 0.75]],
      house: [520, 402, 1.0],
      flowers: [[220, 500, 0], [268, 512, 1], [350, 505, 2], [468, 512, 3], [560, 500, 0], [660, 505, 1], [700, 490, 2], [120, 510, 3]],
      butterflies: [[280, 250, 1.0, 0.4], [470, 210, 0.8, 1.1]],
      fireflies: [[350, 160], [520, 300], [180, 300]],
    },
    differences: [
      { kind: 'color', target: 'flower3', prop: 'colorIndex', delta: 2 },   // flower hue swap
      { kind: 'missing', target: 'butterfly2' },                            // butterfly gone
      { kind: 'size', target: 'mushroom1', prop: 'scale', delta: -0.45 },   // mushroom shrunk
      { kind: 'moved', target: 'house', prop: 'x', delta: -36 },            // mushroom house shifted
      { kind: 'count', target: 'cloud3' },                                  // cloud vanished
      { kind: 'color', target: 'pond', prop: 'fill', delta: 'teal' },       // pond colour changes
    ],
  },
  {
    id: 2,
    name: 'Hutan Jamur',
    timeLimit: 100,
    palette: {
      skyTop: '#4a3f8f', skyMid: '#7b68c9', skyBot: '#c9a7eb',
      sun: '#fff1b8', sunGlow: 'rgba(255,241,184,0.3)',
      hill1: '#3f7d5c', hill2: '#2f6b4f', ground: '#25573d',
      pond: '#3c8ead', pondDeep: '#266a86',
      trunk: '#5c4033', leaf: '#1b4332', leaf2: '#2d6a4f',
      mushroom: '#d1495b', mushroomDot: '#ffe8e8', mushroomStem: '#f2e0cf',
      flower: ['#ffb3c6', '#ffe45e', '#9d8df1', '#5ce1e6'],
      butterfly: '#90e0ef', house: '#ff9770', houseRoof: '#b23a48',
      cloud: 'rgba(230,225,255,0.7)',
    },
    scene: {
      sun: [110, 100, 44],
      clouds: [[500, 90, 0.9], [300, 150, 0.75], [640, 130, 0.85]],
      hills: [[180, 480, 210], [540, 495, 230]],
      pond: [420, 474, 105, 50],
      tree: [660, 405, 0.9],
      mushrooms: [[240, 465, 1.0], [560, 470, 0.85], [330, 430, 0.6], [130, 470, 0.7]],
      house: [180, 398, 0.95],
      flowers: [[300, 512, 1], [390, 505, 2], [470, 514, 0], [600, 508, 3], [680, 498, 1], [90, 505, 2], [480, 498, 3]],
      butterflies: [[380, 220, 1.0, 0.2], [560, 260, 0.85, 0.9], [200, 280, 0.7, 1.5]],
      fireflies: [[420, 170], [620, 330], [150, 200], [280, 340]],
    },
    differences: [
      { kind: 'count', target: 'mushroom2' },                       // a mushroom missing
      { kind: 'size', target: 'house', prop: 'scale', delta: 0.25 },// house bigger
      { kind: 'color', target: 'butterfly1', prop: 'color', delta: '#e76f51' }, // butterfly recoloured
      { kind: 'moved', target: 'pond', prop: 'x', delta: 34 },      // pond shifted
      { kind: 'count', target: 'flower5' },                         // flower gone
      { kind: 'size', target: 'butterfly3', prop: 'scale', delta: 0.7 }, // butterfly grown
      { kind: 'color', target: 'flower2', prop: 'colorIndex', delta: 3 }, // flower hue swap
    ],
  },
  {
    id: 3,
    name: 'Danau Peri',
    timeLimit: 90,
    palette: {
      skyTop: '#0f3460', skyMid: '#3e5c9a', skyBot: '#ffd6e0',
      sun: '#ffdfba', sunGlow: 'rgba(255,223,186,0.3)',
      hill1: '#4d7ea8', hill2: '#3a689c', ground: '#2f5d8a',
      pond: '#5ce1e6', pondDeep: '#2ea6b0',
      trunk: '#6d4c3d', leaf: '#134e4a', leaf2: '#2f7e6d',
      mushroom: '#b56576', mushroomDot: '#ffe5ec', mushroomStem: '#f5e6e8',
      flower: ['#ffc2d1', '#fff275', '#c8a2ff', '#7bf1a8'],
      butterfly: '#fff275', house: '#59c9e5', houseRoof: '#2b6cb0',
      cloud: 'rgba(255,255,255,0.8)',
    },
    scene: {
      sun: [600, 105, 40],
      clouds: [[160, 110, 0.85], [360, 70, 0.7], [530, 120, 0.8]],
      hills: [[170, 485, 200], [500, 495, 245]],
      pond: [380, 476, 130, 60],
      tree: [690, 410, 0.85],
      mushrooms: [[210, 468, 0.9], [580, 465, 0.7], [300, 435, 0.55], [640, 490, 0.65]],
      house: [140, 398, 0.9],
      flowers: [[250, 512, 0], [330, 505, 1], [455, 514, 2], [540, 508, 3], [610, 500, 1], [710, 505, 2], [95, 500, 0], [180, 515, 3]],
      butterflies: [[300, 200, 0.9, 0.7], [480, 240, 0.75, 1.3], [180, 260, 0.6, 0.2], [560, 180, 0.8, 2.0]],
      fireflies: [[390, 160], [610, 320], [140, 190], [270, 330], [460, 360]],
    },
    differences: [
      { kind: 'color', target: 'flower4', prop: 'colorIndex', delta: 1 }, // hue swap
      { kind: 'missing', target: 'butterfly4' },                      // butterfly gone
      { kind: 'size', target: 'mushroom4', prop: 'scale', delta: -0.5 },// mushroom smaller
      { kind: 'moved', target: 'cloud2', prop: 'x', delta: 48 },      // cloud shifted
      { kind: 'count', target: 'flower7' },                           // flower missing
      { kind: 'color', target: 'houseRoof', prop: 'fill', delta: '#8e44ad' }, // roof recoloured
      { kind: 'size', target: 'pond', prop: 'w', delta: -28 },        // pond narrower
      { kind: 'moved', target: 'mushroom2', prop: 'y', delta: 22 },   // mushroom sunk
    ],
  },
];
