# Cari Bedanya

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zenganteng0987/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zenganteng0987/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Game spot-the-difference original: dua gambar nyaris identik berdampingan,
klik 7 perbedaan di tiap scene. Tiga scene bertema Indonesia yang digambar
prosedural di canvas — Taman Senja (mudah), Pasar Pagi (sedang), Dermaga
(sulit) — total 21 perbedaan. Tiap perbedaan yang ketemu diberi marker
lingkaran merah, animasi, dan bunyi; klik salah mengurangi 5 detik dan
menggoyang layar; ada timer per scene, hint (H, maks 3 per scene), skor,
dan layar selesai per scene.

## Cara main

Jalankan server statis apa pun dari folder repo, lalu buka `game/index.html`:

```sh
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080/game/index.html` di Chrome desktop.

- Klik perbedaan di gambar mana pun (kiri atau kanan).
- `H` = hint, `R` = ulang scene, `1/2/3` = pilih scene, `Enter` = mulai / lanjut, `M` = bisu.
- Mode screenshot deterministik: `?shot=start`, `?shot=play`, atau `?shot=end` (tambah `&seed=1`).

## Struktur

- `game/index.html` — halaman game
- `game/src/config.js` — konstanta waktu, skor, hint
- `game/src/scenes.js` — definisi 3 scene dan 7 perbedaan tiap scene
- `game/src/render.js` — gambar dua panel, marker, HUD, counter, timer
- `game/src/audio.js` — bunyi WebAudio
- `game/src/input.js` — klik mouse dan keyboard
- `game/src/main.js` — game loop, state, dan logika

Semua gambar digambar prosedural di canvas dan semua suara lewat WebAudio —
tanpa aset eksternal dan tanpa network request.

## Lisensi

MIT — lihat `LICENSE`.
