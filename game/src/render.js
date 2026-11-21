// Menggambar semua yang terlihat: HUD, dua panel, marker, dan layar.
import { CONFIG } from './config.js';

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

export function drawMarker(ctx, x, y, r, pulse) {
  const rr = r + 4 + (pulse ? Math.sin(performance.now() / 180) * 3 : 0);
  ctx.save();
  ctx.strokeStyle = '#ff3d00';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, rr + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 8);
  ctx.strokeStyle = '#ff3d00';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawPanel(ctx, scene, panelX, variant, found, hint, particles) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, CONFIG.panelY, CONFIG.panelWidth, CONFIG.panelHeight);
  ctx.clip();
  ctx.translate(panelX, CONFIG.panelY);
  scene.draw(ctx, variant);
  for (const idx of found) {
    const d = scene.differences[idx];
    drawMarker(ctx, d.x, d.y, d.r, false);
  }
  if (hint !== null && hint !== undefined) {
    const d = scene.differences[hint];
    drawMarker(ctx, d.x, d.y, d.r, true);
  }
  for (const p of particles) {
    const age = (performance.now() - p.born) / 450;
    if (age >= 1) continue;
    ctx.strokeStyle = 'rgba(255, 61, 0,' + (1 - age) + ')';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10 + age * 46, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = '#263238';
  ctx.lineWidth = 4;
  ctx.strokeRect(panelX, CONFIG.panelY, CONFIG.panelWidth, CONFIG.panelHeight);
}

function drawHud(ctx, state, scene) {
  ctx.fillStyle = '#1b2a33';
  ctx.fillRect(0, 0, CONFIG.canvasWidth, 84);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('CARI BEDANYA', 24, 30);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#b0d8e8';
  ctx.fillText(scene.name + '  •  Scene ' + (state.sceneIndex + 1) + ' dari 3', 24, 60);
  // Counter sisa perbedaan, besar dan jelas di tengah.
  const remaining = scene.differences.length - state.found.size;
  ctx.fillStyle = remaining === 0 ? '#69f0ae' : '#ffd54f';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Sisa: ' + remaining + ' dari ' + scene.differences.length, 640, 34);
  ctx.fillStyle = '#b0d8e8';
  ctx.font = '16px sans-serif';
  ctx.fillText('Ketemu: ' + state.found.size + '   •   Hint: ' + state.hintsLeft + ' (H)', 640, 62);
  // Timer dan skor di kanan.
  ctx.fillStyle = state.timeLeft <= 15 ? '#ff5252' : '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(formatTime(state.timeLeft), 1256, 32);
  ctx.fillStyle = '#b0d8e8';
  ctx.font = '16px sans-serif';
  ctx.fillText('Skor: ' + state.score, 1256, 62);
  // Bar waktu.
  const frac = Math.max(0, state.timeLeft / scene.timeLimit);
  ctx.fillStyle = '#37474f';
  ctx.fillRect(0, 84, CONFIG.canvasWidth, 8);
  ctx.fillStyle = frac > 0.25 ? '#4db6ac' : '#ff5252';
  ctx.fillRect(0, 84, CONFIG.canvasWidth * frac, 8);
  // Label panel.
  ctx.fillStyle = '#b0d8e8';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAMBAR A — ASLI', 320, 106);
  ctx.fillText('GAMBAR B — CARI BEDANYA', 960, 106);
}

function drawBottomBar(ctx, state) {
  ctx.fillStyle = '#1b2a33';
  ctx.fillRect(0, 700, CONFIG.canvasWidth, 100);
  ctx.fillStyle = '#b0d8e8';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Klik perbedaan di gambar mana pun  •  H = hint  •  R = ulang scene  •  1/2/3 = pilih scene  •  Klik salah -5 detik',
    640,
    730,
  );
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Skor total: ' + state.score + '   •   Scene selesai: ' + state.scenesDone + ' dari 3', 640, 762);
}

function drawTitle(ctx, state) {
  ctx.fillStyle = '#12242e';
  ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  ctx.fillStyle = '#ffd54f';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CARI BEDANYA', 640, 180);
  ctx.fillStyle = '#ffffff';
  ctx.font = '28px sans-serif';
  ctx.fillText('Tiga tempat di Indonesia — tujuh perbedaan di tiap scene', 640, 240);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#b0d8e8';
  ctx.fillText('1. Taman Senja — mudah (120 detik)', 640, 310);
  ctx.fillText('2. Pasar Pagi — sedang (100 detik)', 640, 350);
  ctx.fillText('3. Dermaga — sulit (90 detik)', 640, 390);
  ctx.fillStyle = '#69f0ae';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Tekan ENTER atau klik untuk mulai', 640, 480);
  ctx.fillStyle = '#b0d8e8';
  ctx.font = '18px sans-serif';
  ctx.fillText('Klik perbedaan di gambar mana pun. Klik salah mengurangi 5 detik. H untuk hint.', 640, 530);
  ctx.fillText('Skor total: ' + state.score, 640, 570);
}

function drawSceneComplete(ctx, state, scene) {
  ctx.fillStyle = 'rgba(10, 25, 32, 0.82)';
  ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  ctx.fillStyle = '#69f0ae';
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCENE SELESAI!', 640, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = '28px sans-serif';
  ctx.fillText(scene.name + ' — 7 dari 7 perbedaan ketemu', 640, 360);
  ctx.fillText('Bonus waktu: +' + state.lastTimeBonus + '   •   Skor: ' + state.score, 640, 410);
  ctx.fillStyle = '#ffd54f';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Tekan ENTER untuk scene berikutnya — R untuk mengulang', 640, 480);
}

function drawAllDone(ctx, state) {
  ctx.fillStyle = '#12242e';
  ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  ctx.fillStyle = '#ffd54f';
  ctx.font = 'bold 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SEMUA SCENE SELESAI!', 640, 280);
  ctx.fillStyle = '#ffffff';
  ctx.font = '30px sans-serif';
  ctx.fillText('21 perbedaan ketemu — skor akhir: ' + state.score, 640, 350);
  ctx.fillStyle = '#69f0ae';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Tekan R untuk main lagi dari awal', 640, 430);
}

function drawTimeUp(ctx, state) {
  ctx.fillStyle = 'rgba(10, 25, 32, 0.82)';
  ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  ctx.fillStyle = '#ff5252';
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WAKTU HABIS', 640, 320);
  ctx.fillStyle = '#ffffff';
  ctx.font = '26px sans-serif';
  ctx.fillText('Ketemu ' + state.found.size + ' dari 7 perbedaan di scene ini', 640, 380);
  ctx.fillStyle = '#ffd54f';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Tekan R untuk coba lagi — 1/2/3 untuk ganti scene', 640, 440);
}

export function renderGame(ctx, state, scene) {
  ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  if (state.screen === 'title') {
    drawTitle(ctx, state);
    return;
  }
  if (state.screen === 'allDone') {
    drawAllDone(ctx, state);
    return;
  }
  drawHud(ctx, state, scene);
  drawPanel(ctx, scene, CONFIG.leftPanelX, 0, state.found, state.hintIndex, state.particles);
  drawPanel(ctx, scene, CONFIG.rightPanelX, 1, state.found, state.hintIndex, state.particles);
  drawBottomBar(ctx, state);
  if (state.screen === 'sceneComplete') drawSceneComplete(ctx, state, scene);
  if (state.screen === 'timeUp') drawTimeUp(ctx, state);
}
