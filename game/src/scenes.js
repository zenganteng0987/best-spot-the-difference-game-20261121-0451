// Definisi 3 scene original bertema Indonesia.
// Tiap scene menggambar satu gambar di ruang lokal 560x560.
// draw(ctx, variant): variant 0 = gambar asli, variant 1 = gambar berisi
// 7 perbedaan. Daftar differences berisi koordinat lokal tiap perbedaan.

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#3a2e2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x - 10 * s, y, 10 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 10 * s, y, 10 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function flower(ctx, x, y, petalColor) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 10, y + Math.sin(a) * 10, 7, petalColor);
  }
  circle(ctx, x, y, 6, '#ffcf3f');
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 26);
  ctx.stroke();
}

function drawTamanSenja(ctx, variant) {
  const v = variant === 1;
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#ff9a5c');
  sky.addColorStop(0.55, '#ffb37a');
  sky.addColorStop(1, '#ffe0a3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 560);
  // Matahari senja, kanan atas.
  circle(ctx, 430, 110, 55, v ? '#ffd98a' : '#ffdf4d');
  if (!v) {
    ctx.strokeStyle = '#ffdf4d';
    ctx.lineWidth = 6;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(430 + Math.cos(a) * 66, 110 + Math.sin(a) * 66);
      ctx.lineTo(430 + Math.cos(a) * 84, 110 + Math.sin(a) * 84);
      ctx.stroke();
    }
  }
  cloud(ctx, 140, 70, 1);
  cloud(ctx, 330, 55, 0.8);
  if (!v) cloud(ctx, 480, 180, 0.7);
  bird(ctx, 120, 120, 1);
  if (!v) bird(ctx, 205, 92, 1);
  bird(ctx, 290, 130, 0.9);
  // Bukit dan tanah.
  ctx.fillStyle = '#7fae5a';
  ctx.beginPath();
  ctx.moveTo(0, 380);
  ctx.quadraticCurveTo(180, 320, 360, 380);
  ctx.quadraticCurveTo(480, 420, 560, 380);
  ctx.lineTo(560, 560);
  ctx.lineTo(0, 560);
  ctx.closePath();
  ctx.fill();
  // Kolam dan bebek.
  ellipse(ctx, 150, 480, 110, 34, '#6fc3e8');
  ellipse(ctx, 150, 480, 88, 24, '#8fd4f0');
  if (!v) {
    ellipse(ctx, 150, 472, 16, 11, '#ffffff');
    circle(ctx, 162, 458, 8, '#ffffff');
    circle(ctx, 165, 456, 2, '#222222');
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath();
    ctx.moveTo(170, 458);
    ctx.lineTo(180, 461);
    ctx.lineTo(170, 464);
    ctx.closePath();
    ctx.fill();
  }
  // Jalan setapak.
  ctx.fillStyle = '#e8c890';
  ctx.beginPath();
  ctx.moveTo(250, 560);
  ctx.lineTo(300, 400);
  ctx.lineTo(330, 400);
  ctx.lineTo(360, 560);
  ctx.closePath();
  ctx.fill();
  // Pohon kiri dengan apel.
  rect(ctx, 82, 300, 18, 110, '#6d4c2f');
  circle(ctx, 92, 270, 62, '#3e8e41');
  circle(ctx, 55, 295, 40, '#4caf50');
  circle(ctx, 130, 295, 40, '#43a047');
  if (!v) circle(ctx, 92, 300, 9, '#e53935');
  circle(ctx, 118, 268, 9, '#e53935');
  circle(ctx, 62, 262, 9, '#e53935');
  // Pohon kanan.
  rect(ctx, 470, 320, 16, 90, '#6d4c2f');
  circle(ctx, 478, 295, 48, '#2f7d33');
  circle(ctx, 445, 315, 32, '#388e3c');
  // Bangku taman.
  rect(ctx, 320, 420, 110, 10, '#8d5a2b');
  rect(ctx, 320, 440, 110, 10, '#8d5a2b');
  if (!v) rect(ctx, 320, 400, 110, 10, '#8d5a2b');
  rect(ctx, 328, 400, 8, 70, '#6d4420');
  rect(ctx, 414, 400, 8, 70, '#6d4420');
  // Bunga di depan.
  flower(ctx, 120, 520, v ? '#3f7de0' : '#e53935');
  flower(ctx, 210, 530, '#e53935');
  flower(ctx, 450, 525, '#ff8f00');
  flower(ctx, 510, 535, '#e53935');
  flower(ctx, 40, 535, '#ff8f00');
}

function drawPasarPagi(ctx, variant) {
  const v = variant === 1;
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#bfe6ff');
  sky.addColorStop(1, '#fff3c4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 560);
  circle(ctx, 80, 70, 34, '#ffdf4d');
  cloud(ctx, 380, 60, 0.9);
  cloud(ctx, 200, 40, 0.7);
  // Tanah pasar.
  rect(ctx, 0, 400, 560, 160, '#d9b380');
  // Kios: tiang, atap garis, papan nama.
  rect(ctx, 90, 120, 14, 300, '#7a5230');
  rect(ctx, 456, 120, 14, 300, '#7a5230');
  for (let i = 0; i < 8; i++) {
    const x = 84 + i * 48;
    rect(ctx, x, 84, 48, 36, i % 2 === 0 ? '#d32f2f' : '#ffffff');
  }
  if (v) rect(ctx, 276, 84, 48, 36, '#2e9e4f');
  rect(ctx, 84, 120, 392, 8, '#7a5230');
  // Papan nama PASAR.
  rect(ctx, 190, 140, 180, 44, '#4a2f1d');
  ctx.fillStyle = '#ffe082';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(v ? 'PASOR' : 'PASAR', 280, 163);
  // Meja dagangan.
  rect(ctx, 100, 340, 360, 90, '#8d5a2b');
  rect(ctx, 100, 340, 360, 12, '#a9713d');
  // Tumpukan jeruk.
  for (let i = 0; i < 4; i++) circle(ctx, 150 + i * 30, 332, 14, '#ff8c1a');
  if (!v) circle(ctx, 165, 306, 14, '#ff8c1a');
  for (let i = 0; i < 3; i++) circle(ctx, 165 + i * 30, 332, 14, '#ff8c1a');
  // Pisang.
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(300, 320, 26, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(310, 322, 22, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  // Apel merah.
  circle(ctx, 390, 326, 13, '#e53935');
  circle(ctx, 416, 326, 13, '#e53935');
  circle(ctx, 403, 306, 13, '#e53935');
  // Pedagang dengan topi.
  circle(ctx, 300, 230, 26, '#f2c297');
  if (!v) {
    ctx.fillStyle = '#6d4c2f';
    ctx.beginPath();
    ctx.arc(300, 222, 26, Math.PI, 0);
    ctx.fill();
    rect(ctx, 268, 218, 64, 8, '#6d4c2f');
  }
  rect(ctx, 268, 256, 64, 84, '#2e7d9e');
  // Payung warna-warni.
  ctx.fillStyle = v ? '#8e44ad' : '#1976d2';
  ctx.beginPath();
  ctx.arc(470, 130, 55, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 466, 130, 8, 120, '#5d4037');
  // Keranjang di lantai.
  ellipse(ctx, 120, 470, 46, 26, '#b07a3e');
  ellipse(ctx, 120, 458, 46, 14, '#8d5a2b');
  circle(ctx, 108, 450, 8, '#7cb342');
  circle(ctx, 126, 448, 8, '#7cb342');
  ellipse(ctx, 250, 480, 40, 22, '#b07a3e');
  if (v) {
    ellipse(ctx, 430, 470, 40, 22, '#b07a3e');
    ellipse(ctx, 430, 458, 40, 12, '#8d5a2b');
    circle(ctx, 430, 450, 8, '#e53935');
  }
  // Kucing duduk.
  if (!v) {
    ellipse(ctx, 90, 470, 22, 18, '#ff8a65');
    circle(ctx, 88, 446, 14, '#ff8a65');
    ctx.fillStyle = '#ff8a65';
    ctx.beginPath();
    ctx.moveTo(78, 438);
    ctx.lineTo(82, 424);
    ctx.lineTo(88, 438);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(92, 438);
    ctx.lineTo(98, 424);
    ctx.lineTo(102, 438);
    ctx.closePath();
    ctx.fill();
  }
  // Karung beras.
  ellipse(ctx, 500, 500, 34, 26, '#efe0c0');
  rect(ctx, 486, 468, 28, 14, '#d9c49a');
}

function drawDermaga(ctx, variant) {
  const v = variant === 1;
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#7fb3d5');
  sky.addColorStop(0.6, '#cfe8f5');
  sky.addColorStop(0.6, '#2e86ab');
  sky.addColorStop(1, '#1d6a8a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 560);
  cloud(ctx, 90, 60, 0.8);
  cloud(ctx, 400, 45, 0.7);
  bird(ctx, 250, 80, 0.9);
  if (!v) bird(ctx, 330, 62, 0.9);
  bird(ctx, 150, 100, 0.8);
  // Mercusuar.
  rect(ctx, 92, 150, 56, 190, '#f5f5f5');
  rect(ctx, 92, 190, 56, 30, '#d32f2f');
  rect(ctx, 92, 260, 56, 30, '#d32f2f');
  rect(ctx, 84, 120, 72, 34, '#37474f');
  circle(ctx, 120, 137, 12, v ? '#ffffff' : '#ffeb3b');
  if (!v) {
    ctx.fillStyle = 'rgba(255, 235, 59, 0.35)';
    ctx.beginPath();
    ctx.moveTo(156, 137);
    ctx.lineTo(230, 100);
    ctx.lineTo(230, 175);
    ctx.closePath();
    ctx.fill();
  }
  // Laut dan ombak.
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(120 + i * 120, 430 + (i % 2) * 18, 26, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  // Perahu layar.
  ctx.fillStyle = '#8d5a2b';
  ctx.beginPath();
  ctx.moveTo(280, 300);
  ctx.lineTo(440, 300);
  ctx.lineTo(410, 335);
  ctx.lineTo(310, 335);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 356, 150, 8, 150, '#6d4420');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(364, 160);
  ctx.lineTo(364, 290);
  ctx.lineTo(430, 290);
  ctx.closePath();
  ctx.fill();
  if (!v) rect(ctx, 320, 308, 22, 16, '#ffe082');
  // Bendera di tiang perahu.
  ctx.fillStyle = v ? '#1976d2' : '#d32f2f';
  ctx.beginPath();
  ctx.moveTo(364, 150);
  ctx.lineTo(398, 158);
  ctx.lineTo(364, 168);
  ctx.closePath();
  ctx.fill();
  // Dermaga kayu.
  rect(ctx, 0, 380, 560, 130, '#9c6b3f');
  ctx.strokeStyle = '#7a4f28';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(70 + i * 70, 380);
    ctx.lineTo(70 + i * 70, 510);
    ctx.stroke();
  }
  rect(ctx, 40, 380, 14, 130, '#7a4f28');
  rect(ctx, 200, 380, 14, 130, '#7a4f28');
  rect(ctx, 360, 380, 14, 130, '#7a4f28');
  rect(ctx, 500, 380, 14, 130, '#7a4f28');
  // Tali antar tiang.
  if (!v) {
    ctx.strokeStyle = '#e8dcc0';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(54, 400);
    ctx.quadraticCurveTo(127, 430, 200, 400);
    ctx.stroke();
  }
  // Peti kayu.
  rect(ctx, 430, 440, 52, 52, '#b07a3e');
  ctx.strokeStyle = '#7a4f28';
  ctx.lineWidth = 3;
  ctx.strokeRect(430, 440, 52, 52);
  ctx.beginPath();
  ctx.moveTo(430, 440);
  ctx.lineTo(482, 492);
  ctx.stroke();
  if (v) {
    rect(ctx, 300, 452, 40, 40, '#b07a3e');
    ctx.strokeRect(300, 452, 40, 40);
  }
  // Pelampung di air.
  circle(ctx, 500, 420, 16, '#ffffff');
  rect(ctx, 484, 412, 32, 8, v ? '#1976d2' : '#e53935');
  rect(ctx, 484, 424, 32, 8, v ? '#1976d2' : '#e53935');
  // Tiang lampu dermaga.
  rect(ctx, 520, 340, 8, 70, '#37474f');
  circle(ctx, 524, 332, 12, '#ffeb3b');
}

export const SCENES = [
  {
    id: 'taman-senja',
    name: 'Taman Senja',
    subtitle: 'Taman saat matahari terbenam — level mudah',
    timeLimit: 120,
    draw: drawTamanSenja,
    differences: [
      { x: 430, y: 110, r: 60, label: 'Sinar matahari' },
      { x: 205, y: 92, r: 18, label: 'Burung di langit' },
      { x: 120, y: 520, r: 16, label: 'Warna bunga' },
      { x: 374, y: 405, r: 22, label: 'Papan bangku' },
      { x: 500, y: 180, r: 30, label: 'Awan kecil' },
      { x: 92, y: 300, r: 14, label: 'Apel di pohon' },
      { x: 152, y: 468, r: 20, label: 'Bebek di kolam' },
    ],
  },
  {
    id: 'pasar-pagi',
    name: 'Pasar Pagi',
    subtitle: 'Kios buah di pasar pagi — level sedang',
    timeLimit: 100,
    draw: drawPasarPagi,
    differences: [
      { x: 300, y: 102, r: 20, label: 'Garis atap kios' },
      { x: 165, y: 306, r: 16, label: 'Jeruk di tumpukan' },
      { x: 430, y: 462, r: 22, label: 'Keranjang tambahan' },
      { x: 280, y: 162, r: 22, label: 'Tulisan papan nama' },
      { x: 470, y: 110, r: 25, label: 'Warna payung' },
      { x: 300, y: 222, r: 22, label: 'Topi pedagang' },
      { x: 90, y: 458, r: 20, label: 'Kucing di lantai' },
    ],
  },
  {
    id: 'dermaga',
    name: 'Dermaga',
    subtitle: 'Pelabuhan dan mercusuar — level sulit',
    timeLimit: 90,
    draw: drawDermaga,
    differences: [
      { x: 140, y: 137, r: 18, label: 'Cahaya mercusuar' },
      { x: 127, y: 414, r: 14, label: 'Tali dermaga' },
      { x: 320, y: 472, r: 16, label: 'Peti tambahan' },
      { x: 380, y: 158, r: 12, label: 'Warna bendera' },
      { x: 331, y: 316, r: 12, label: 'Jendela perahu' },
      { x: 330, y: 62, r: 12, label: 'Burung camar' },
      { x: 500, y: 420, r: 14, label: 'Garis pelampung' },
    ],
  },
];
