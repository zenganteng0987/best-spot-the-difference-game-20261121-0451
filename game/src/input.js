// Input mouse dan keyboard: mengubah klik layar jadi koordinat kanvas.
import { CONFIG } from './config.js';

export function canvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = CONFIG.canvasWidth / rect.width;
  const scaleY = CONFIG.canvasHeight / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function panelAt(point) {
  const inY = point.y >= CONFIG.panelY && point.y <= CONFIG.panelY + CONFIG.panelHeight;
  if (!inY) return null;
  if (point.x >= CONFIG.leftPanelX && point.x <= CONFIG.leftPanelX + CONFIG.panelWidth) {
    return { side: 'left', x: point.x - CONFIG.leftPanelX, y: point.y - CONFIG.panelY };
  }
  if (point.x >= CONFIG.rightPanelX && point.x <= CONFIG.rightPanelX + CONFIG.panelWidth) {
    return { side: 'right', x: point.x - CONFIG.rightPanelX, y: point.y - CONFIG.panelY };
  }
  return null;
}

export function attachInput(canvas, handlers) {
  canvas.addEventListener('click', (event) => {
    const point = canvasPoint(canvas, event.clientX, event.clientY);
    handlers.onClick(point);
  });
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'r') handlers.onRestart();
    else if (key === 'enter' || key === ' ') handlers.onConfirm();
    else if (key === '1' || key === '2' || key === '3') handlers.onSceneSelect(Number(key) - 1);
    else if (key === 'm') handlers.onMute();
  });
}
