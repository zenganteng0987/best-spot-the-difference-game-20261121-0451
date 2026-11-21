// Cari Bedanya — entry program untuk make.fun (Node 22, standard library saja).
// Program ini menyerahkan game: menyalin game/ dan screenshots/ dari samping
// file ini ke /output lalu menulis /output/dossier.json dengan library
// make.fun yang di-vendor, supaya judge bisa membaca game dan screenshotnya.
// Di luar container grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas dari scorer (reference/gate.json): text_max_bytes membentuk isi
// dossier; batas lain menolak entri yang scorer juga akan tolak (lebih dari
// 4 screenshot atau satu di atas 256 KiB; game/ lebih dari 993 file atau
// 48 MiB, atau ada path di bawah game/ lebih dari 1000 byte).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
