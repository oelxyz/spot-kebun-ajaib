// Kebun Ajaib — hand-in program.
//
// Runs on Node 22 (plain TS, stdlib only). Job: stage the entry for the
// grader — copy the playable game and its screenshots into the output
// directory, then write dossier.json through the kit's buildDossier so the
// judge gets the standard summary of our source.
//
// Outside the grader container, MAKEFUN_OUTPUT_DIR replaces /output:
//   rm -rf out && mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

// Caps the sealed scorer enforces on /output. We pre-check them here so a
// bad state fails fast with a readable message instead of a gate refusal.
const CAPS = {
  screenshotMaxCount: 4,
  screenshotMaxBytes: 262144, // 256 KiB per image
  screenshotMinCount: 3,
  gameMaxEntries: 993, // files + dirs under game/
  gameMaxBytes: 50331648, // 48 MiB of game payload
  gamePathMaxBytes: 1000, // longest UTF-8 path under game/
};

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg']);

function die(msg) {
  console.error(`hand-in failed: ${msg}`);
  process.exit(1);
}

// Count every file and directory below root, plus their combined size.
function measureTree(root) {
  let entries = 0;
  let bytes = 0;
  const walk = (dir, rel = '') => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const relPath = rel ? `${rel}/${name}` : name;
      entries += 1;
      const relBytes = Buffer.byteLength(relPath, 'utf8');
      if (relBytes > CAPS.gamePathMaxBytes) {
        die(`game path too long (${relBytes} bytes): ${relPath}`);
      }
      const info = statSync(full);
      if (info.isDirectory()) walk(full, relPath);
      else bytes += info.size;
    }
  };
  walk(root);
  return { entries, bytes };
}

function stage() {
  // The entry is meaningless without its front door — check it first.
  const gameDir = join(repoDir, 'game');
  if (!existsSync(join(gameDir, 'index.html'))) {
    die('game/index.html is missing; nothing to hand in');
  }

  const shotsDir = join(repoDir, 'screenshots');
  const shotFiles = existsSync(shotsDir)
    ? readdirSync(shotsDir)
        .filter((n) => IMAGE_EXT.has(extname(n).toLowerCase()))
        .sort()
    : [];
  if (
    shotFiles.length < CAPS.screenshotMinCount ||
    shotFiles.length > CAPS.screenshotMaxCount
  ) {
    die(`expected 3-4 screenshots, found ${shotFiles.length}`);
  }

  // Copy the game tree, then the screenshots one by one so each image's
  // size can be checked against the per-file cap as it lands.
  mkdirSync(outDir, { recursive: true });
  cpSync(gameDir, join(outDir, 'game'), { recursive: true });

  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  for (const name of shotFiles) {
    const src = join(shotsDir, name);
    const size = statSync(src).size;
    if (size > CAPS.screenshotMaxBytes) {
      die(`${name} is ${size} bytes, over the ${CAPS.screenshotMaxBytes} cap`);
    }
    copyFileSync(src, join(outDir, 'screenshots', name));
  }

  // Sanity-check what we just staged: the tree must fit the game caps.
  const staged = measureTree(join(outDir, 'game'));
  if (staged.entries > CAPS.gameMaxEntries) {
    die(`game/ holds ${staged.entries} entries, cap is ${CAPS.gameMaxEntries}`);
  }
  if (staged.bytes > CAPS.gameMaxBytes) {
    die(`game/ payload is ${staged.bytes} bytes, cap is ${CAPS.gameMaxBytes}`);
  }

  return { shotFiles, staged };
}

// Build the judge's dossier from the staged copy — same bytes the grader
// will rebuild, so run it against outDir, never the repo copy.
function writeDossier() {
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: CAPS.screenshotMaxCount, max_bytes: CAPS.screenshotMaxBytes },
    game_max_files: CAPS.gameMaxEntries,
    game_max_bytes: CAPS.gameMaxBytes,
    game_path_max_bytes: CAPS.gamePathMaxBytes,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

const { shotFiles, staged } = stage();
writeDossier();

console.log(
  `hand-in ok: game/ ${staged.entries} entries ${(staged.bytes / 1048576).toFixed(2)} MiB, ` +
    `screenshots ${shotFiles.length} (${shotFiles.join(', ')}), ` +
    `dossier.json ${(statSync(join(outDir, 'dossier.json')).size / 1024).toFixed(1)} KiB -> ${outDir}`,
);
