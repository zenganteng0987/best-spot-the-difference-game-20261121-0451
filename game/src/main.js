// Game loop, state permainan, dan logika cari bedanya.
import { CONFIG } from './config.js';
import { SCENES } from './scenes.js';
import { renderGame } from './render.js';
import { attachInput, panelAt } from './input.js';
import {
  playFoundSound,
  playWrongSound,
  playHintSound,
  playWinSound,
  playClickSound,
  setMuted,
  isMuted,
} from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const state = {
  screen: 'title', // title | playing | sceneComplete | timeUp | allDone
  sceneIndex: 0,
  found: new Set(),
  score: 0,
  timeLeft: SCENES[0].timeLimit,
  hintsLeft: CONFIG.maxHintsPerScene,
  hintIndex: null,
  hintUntil: 0,
  hintCooldownUntil: 0,
  particles: [],
  scenesDone: 0,
  lastTimeBonus: 0,
  shakeUntil: 0,
};

function currentScene() {
  return SCENES[state.sceneIndex];
}

function startScene(index) {
  state.sceneIndex = index;
  state.found = new Set();
  state.timeLeft = SCENES[index].timeLimit;
  state.hintsLeft = CONFIG.maxHintsPerScene;
  state.hintIndex = null;
  state.particles = [];
  state.screen = 'playing';
  announce('Scene ' + SCENES[index].name + ' dimulai. Sisa 7 dari 7 perbedaan.');
}

function announce(text) {
  if (statusEl) statusEl.textContent = text;
}

function useHint() {
  if (state.screen !== 'playing') return;
  const now = performance.now();
  if (state.hintsLeft <= 0) return;
  if (now < state.hintCooldownUntil) return;
  const scene = currentScene();
  const remaining = scene.differences
    .map((d, i) => i)
    .filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  state.hintIndex = remaining[Math.floor(remaining.length / 2)];
  state.hintsLeft -= 1;
  state.hintUntil = now + CONFIG.hintShowMs;
  state.hintCooldownUntil = now + CONFIG.hintCooldownMs;
  playHintSound();
  announce('Hint: lihat lingkaran yang berdenyut. Sisa hint ' + state.hintsLeft + '.');
}

function handlePanelClick(point) {
  if (state.screen !== 'playing') {
    if (state.screen === 'title') startScene(0);
    return;
  }
  const panel = panelAt(point);
  if (!panel) return;
  const scene = currentScene();
  let hit = -1;
  for (let i = 0; i < scene.differences.length; i++) {
    if (state.found.has(i)) continue;
    const d = scene.differences[i];
    const dx = panel.x - d.x;
    const dy = panel.y - d.y;
    if (Math.sqrt(dx * dx + dy * dy) <= d.r + CONFIG.clickTolerance) {
      hit = i;
      break;
    }
  }
  if (hit >= 0) {
    state.found.add(hit);
    state.score += CONFIG.scorePerFind;
    state.particles.push({ x: panel.x, y: panel.y, born: performance.now() });
    playFoundSound();
    const remaining = scene.differences.length - state.found.size;
    announce('Ketemu! ' + scene.differences[hit].label + '. Sisa ' + remaining + ' dari 7.');
    if (state.found.size === scene.differences.length) {
      state.lastTimeBonus = Math.round(state.timeLeft) * CONFIG.timeBonusPerSecond;
      state.score += state.lastTimeBonus;
      state.scenesDone += 1;
      state.screen = 'sceneComplete';
      playWinSound();
      announce('Scene selesai! Bonus waktu +' + state.lastTimeBonus + '.');
    }
  } else {
    state.timeLeft = Math.max(0, state.timeLeft - CONFIG.wrongClickPenaltySeconds);
    state.shakeUntil = performance.now() + 180;
    playWrongSound();
    announce('Bukan di situ. Waktu berkurang 5 detik.');
  }
}

function onConfirm() {
  if (state.screen === 'title') {
    playClickSound();
    startScene(0);
  } else if (state.screen === 'sceneComplete') {
    playClickSound();
    if (state.sceneIndex + 1 >= SCENES.length) {
      state.screen = 'allDone';
    } else {
      startScene(state.sceneIndex + 1);
    }
  } else if (state.screen === 'timeUp') {
    startScene(state.sceneIndex);
  }
}

function onRestart() {
  playClickSound();
  if (state.screen === 'allDone') {
    state.score = 0;
    state.scenesDone = 0;
    startScene(0);
  } else {
    startScene(state.sceneIndex);
  }
}

attachInput(canvas, {
  onClick: handlePanelClick,
  onHint: useHint,
  onRestart,
  onConfirm,
  onSceneSelect: (index) => {
    if (index < SCENES.length) {
      playClickSound();
      startScene(index);
    }
  },
  onMute: () => setMuted(!isMuted()),
});

// Mode screenshot deterministik dari parameter URL (?shot=...&seed=...).
function applyShotMode() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return;
  if (shot === 'start') {
    state.screen = 'title';
  } else if (shot === 'play') {
    startScene(0);
    state.found = new Set([0, 1, 2]);
    state.score = 300;
    state.timeLeft = 87;
    state.particles = [];
  } else if (shot === 'end') {
    startScene(0);
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.timeLeft = 42;
    state.lastTimeBonus = 210;
    state.score = 910;
    state.scenesDone = 1;
    state.screen = 'sceneComplete';
    state.particles = [];
  }
}

function fitCanvas() {
  const scale = Math.min(
    window.innerWidth / CONFIG.canvasWidth,
    window.innerHeight / CONFIG.canvasHeight,
  );
  canvas.style.width = Math.floor(CONFIG.canvasWidth * scale) + 'px';
  canvas.style.height = Math.floor(CONFIG.canvasHeight * scale) + 'px';
}

window.addEventListener('resize', fitCanvas);
fitCanvas();
applyShotMode();

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  if (state.screen === 'playing') {
    state.timeLeft -= dt;
    if (state.hintIndex !== null && now > state.hintUntil) state.hintIndex = null;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'timeUp';
      playWrongSound();
      announce('Waktu habis.');
    }
  }
  state.particles = state.particles.filter((p) => now - p.born < 500);
  ctx.save();
  if (now < state.shakeUntil) {
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }
  renderGame(ctx, state, currentScene());
  ctx.restore();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
