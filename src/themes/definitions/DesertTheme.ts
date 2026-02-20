import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const DesertTheme: ThemeConfig = {
  id: 'desert',
  name: 'Pustynia',
  description: 'Piasek, piramidy, kaktusy',

  drawBackground(rc: RenderContext) {
    const p = rc.padding;
    const gw = rc.canvasWidth - p * 2;
    const gh = rc.canvasHeight - p * 2;
    const grad = rc.ctx.createLinearGradient(p, p, p, p + gh);
    grad.addColorStop(0, '#fff8e1');
    grad.addColorStop(1, '#ffe0b2');
    rc.ctx.fillStyle = grad;
    rc.ctx.fillRect(p, p, gw, gh);
  },

  drawPath(rc: RenderContext, cellRect: CellRect) {
    rc.ctx.fillStyle = '#fff3e0';
    rc.ctx.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
  },

  drawPathDecoration(rc: RenderContext, cellRect: CellRect, random: SeededRandom) {
    const r = random.next();
    if (r < 0.1) {
      // Cactus
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * 0.65;
      const h = rc.cellSize * 0.3;
      const w = rc.cellSize * 0.06;

      rc.ctx.fillStyle = '#4caf50';
      // Main trunk
      rc.ctx.fillRect(cx - w / 2, cy - h, w, h);
      // Left arm
      rc.ctx.fillRect(cx - w * 2.5, cy - h * 0.6, w * 2, w);
      rc.ctx.fillRect(cx - w * 2.5, cy - h * 0.8, w, h * 0.2 + w);
      // Right arm
      rc.ctx.fillRect(cx + w / 2, cy - h * 0.4, w * 2, w);
      rc.ctx.fillRect(cx + w * 2, cy - h * 0.65, w, h * 0.25 + w);
    } else if (r < 0.15) {
      // Small rocks
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * 0.7;
      const size = rc.cellSize * 0.06;

      rc.ctx.fillStyle = '#bcaaa4';
      rc.ctx.beginPath();
      rc.ctx.ellipse(cx, cy, size * 1.5, size, 0, 0, Math.PI * 2);
      rc.ctx.fill();
      rc.ctx.fillStyle = '#a1887f';
      rc.ctx.beginPath();
      rc.ctx.ellipse(cx + size * 1.5, cy - size * 0.3, size, size * 0.7, 0.3, 0, Math.PI * 2);
      rc.ctx.fill();
    }
  },

  drawWall(rc: RenderContext, from: Point, to: Point) {
    // Sandy/brown wall
    rc.ctx.strokeStyle = '#8d6e63';
    rc.ctx.lineWidth = 3;
    rc.ctx.lineCap = 'round';
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();

    // Sand highlight
    rc.ctx.strokeStyle = '#a1887f';
    rc.ctx.lineWidth = 1;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const nx = -dy;
    const ny = dx;
    const len = Math.hypot(nx, ny);
    if (len > 0) {
      const offset = 1.5;
      rc.ctx.beginPath();
      rc.ctx.moveTo(from.x + (nx / len) * offset, from.y + (ny / len) * offset);
      rc.ctx.lineTo(to.x + (nx / len) * offset, to.y + (ny / len) * offset);
      rc.ctx.stroke();
    }
  },

  drawEntrance(rc: RenderContext, cellRect: CellRect) {
    // Camel
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height * 0.55;
    const s = rc.cellSize * 0.28;

    // Body
    rc.ctx.fillStyle = '#c8a46e';
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx, cy, s * 0.9, s * 0.4, 0, 0, Math.PI * 2);
    rc.ctx.fill();

    // Hump
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx + s * 0.1, cy - s * 0.5, s * 0.35, s * 0.25, -0.2, 0, Math.PI * 2);
    rc.ctx.fill();

    // Neck
    rc.ctx.fillStyle = '#c8a46e';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.5, cy - s * 0.2);
    rc.ctx.quadraticCurveTo(cx - s * 0.75, cy - s * 0.8, cx - s * 0.6, cy - s * 1.2);
    rc.ctx.lineTo(cx - s * 0.4, cy - s * 1.15);
    rc.ctx.quadraticCurveTo(cx - s * 0.55, cy - s * 0.7, cx - s * 0.35, cy - s * 0.15);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Head
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx - s * 0.55, cy - s * 1.3, s * 0.22, s * 0.15, -0.3, 0, Math.PI * 2);
    rc.ctx.fill();

    // Eye
    rc.ctx.fillStyle = '#3e2723';
    rc.ctx.beginPath();
    rc.ctx.arc(cx - s * 0.48, cy - s * 1.33, s * 0.04, 0, Math.PI * 2);
    rc.ctx.fill();

    // Legs (4)
    rc.ctx.strokeStyle = '#b5944f';
    rc.ctx.lineWidth = 2.5;
    rc.ctx.lineCap = 'round';
    const legXs = [-0.5, -0.2, 0.2, 0.55];
    for (const lx of legXs) {
      rc.ctx.beginPath();
      rc.ctx.moveTo(cx + s * lx, cy + s * 0.3);
      rc.ctx.lineTo(cx + s * lx, cy + s * 0.85);
      rc.ctx.stroke();
    }

    // Tail
    rc.ctx.strokeStyle = '#b5944f';
    rc.ctx.lineWidth = 1.5;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx + s * 0.85, cy - s * 0.1);
    rc.ctx.quadraticCurveTo(cx + s * 1.1, cy - s * 0.3, cx + s * 1.0, cy - s * 0.5);
    rc.ctx.stroke();
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    // Oasis with palm tree
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height * 0.55;
    const size = rc.cellSize * 0.3;

    // Water pond
    rc.ctx.fillStyle = '#4fc3f7';
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx, cy + size * 0.3, size * 1.1, size * 0.5, 0, 0, Math.PI * 2);
    rc.ctx.fill();
    // Water highlight
    rc.ctx.fillStyle = 'rgba(255,255,255,0.3)';
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx - size * 0.3, cy + size * 0.2, size * 0.3, size * 0.12, -0.2, 0, Math.PI * 2);
    rc.ctx.fill();

    // Palm trunk (curved)
    rc.ctx.strokeStyle = '#795548';
    rc.ctx.lineWidth = 3;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy + size * 0.3);
    rc.ctx.quadraticCurveTo(cx + size * 0.4, cy - size * 0.5, cx + size * 0.15, cy - size * 1.1);
    rc.ctx.stroke();

    // Palm leaves (5 leaves fanning out)
    rc.ctx.fillStyle = '#66bb6a';
    const leafBase = { x: cx + size * 0.15, y: cy - size * 1.1 };
    for (let i = 0; i < 5; i++) {
      const angle = -1.2 + i * 0.6;
      rc.ctx.beginPath();
      rc.ctx.moveTo(leafBase.x, leafBase.y);
      rc.ctx.quadraticCurveTo(
        leafBase.x + Math.cos(angle) * size * 1.2,
        leafBase.y + Math.sin(angle) * size * 0.3 - size * 0.4,
        leafBase.x + Math.cos(angle) * size * 1.5,
        leafBase.y + Math.sin(angle) * size * 0.9,
      );
      rc.ctx.quadraticCurveTo(
        leafBase.x + Math.cos(angle) * size * 0.7,
        leafBase.y + Math.sin(angle) * size * 0.2,
        leafBase.x,
        leafBase.y,
      );
      rc.ctx.fill();
    }

    // Coconuts
    rc.ctx.fillStyle = '#6d4c41';
    rc.ctx.beginPath();
    rc.ctx.arc(leafBase.x + size * 0.08, leafBase.y + size * 0.1, size * 0.08, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.beginPath();
    rc.ctx.arc(leafBase.x - size * 0.06, leafBase.y + size * 0.12, size * 0.07, 0, Math.PI * 2);
    rc.ctx.fill();
  },

  printVariant: {
    drawBackground() { },
    drawPath() { },
    drawPathDecoration() { },
    drawWall(rc: RenderContext, from: Point, to: Point) {
      rc.ctx.strokeStyle = '#000000';
      rc.ctx.lineWidth = 1.5;
      rc.ctx.lineCap = 'round';
      rc.ctx.beginPath();
      rc.ctx.moveTo(from.x, from.y);
      rc.ctx.lineTo(to.x, to.y);
      rc.ctx.stroke();
    },
  },
};
