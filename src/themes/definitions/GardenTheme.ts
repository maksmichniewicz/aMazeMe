import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const GardenTheme: ThemeConfig = {
  id: 'garden',
  name: 'Ogród',
  description: 'Żywopłot, kwiaty, motyle',

  drawBackground(rc: RenderContext) {
    const p = rc.padding;
    const gw = rc.canvasWidth - p * 2;
    const gh = rc.canvasHeight - p * 2;
    const grad = rc.ctx.createLinearGradient(p, p, p, p + gh);
    grad.addColorStop(0, '#e8f5e9');
    grad.addColorStop(1, '#c8e6c9');
    rc.ctx.fillStyle = grad;
    rc.ctx.fillRect(p, p, gw, gh);
  },

  drawPath(rc: RenderContext, cellRect: CellRect) {
    rc.ctx.fillStyle = '#f1f8e9';
    rc.ctx.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
  },

  drawPathDecoration(rc: RenderContext, cellRect: CellRect, random: SeededRandom) {
    const r = random.next();
    if (r < 0.05) {
      // Small flower — rare
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * (0.3 + random.next() * 0.4);
      const size = rc.cellSize * 0.08;
      const colors = ['#e91e63', '#ff5722', '#ff9800', '#9c27b0'];
      const color = colors[Math.floor(random.next() * colors.length)];

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const px = cx + Math.cos(angle) * size;
        const py = cy + Math.sin(angle) * size;
        rc.ctx.fillStyle = color;
        rc.ctx.beginPath();
        rc.ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
        rc.ctx.fill();
      }
      rc.ctx.fillStyle = '#ffeb3b';
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      rc.ctx.fill();
    }
  },

  drawWall(rc: RenderContext, from: Point, to: Point) {
    // Solid green hedge
    rc.ctx.strokeStyle = '#2e7d32';
    rc.ctx.lineWidth = 5;
    rc.ctx.lineCap = 'round';
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();

    // Darker inner line for depth
    rc.ctx.strokeStyle = '#1b5e20';
    rc.ctx.lineWidth = 1.5;
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();
  },

  drawEntrance(rc: RenderContext, cellRect: CellRect) {
    // Stick figure (garden green)
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.3;

    rc.ctx.strokeStyle = '#2e7d32';
    rc.ctx.lineWidth = 2;
    rc.ctx.lineCap = 'round';

    // Head
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - s * 0.7, s * 0.22, 0, Math.PI * 2);
    rc.ctx.stroke();

    // Body
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy - s * 0.48);
    rc.ctx.lineTo(cx, cy + s * 0.2);
    rc.ctx.stroke();

    // Arms
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.4, cy - s * 0.15);
    rc.ctx.lineTo(cx, cy - s * 0.3);
    rc.ctx.lineTo(cx + s * 0.4, cy - s * 0.15);
    rc.ctx.stroke();

    // Legs
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.35, cy + s * 0.7);
    rc.ctx.lineTo(cx, cy + s * 0.2);
    rc.ctx.lineTo(cx + s * 0.35, cy + s * 0.7);
    rc.ctx.stroke();
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    // Large golden sunflower
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const size = rc.cellSize * 0.32;

    // Stem
    rc.ctx.strokeStyle = '#558b2f';
    rc.ctx.lineWidth = 3;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy + size * 0.5);
    rc.ctx.lineTo(cx, cy + size * 1.1);
    rc.ctx.stroke();

    // Leaves on stem
    rc.ctx.fillStyle = '#66bb6a';
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx - size * 0.3, cy + size * 0.8, size * 0.2, size * 0.08, -0.5, 0, Math.PI * 2);
    rc.ctx.fill();

    // Petals (two layers)
    for (let layer = 0; layer < 2; layer++) {
      const petalCount = layer === 0 ? 12 : 8;
      const petalSize = layer === 0 ? size : size * 0.85;
      const offset = layer * 0.26;
      rc.ctx.fillStyle = layer === 0 ? '#f9a825' : '#fdd835';
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount + offset;
        const px = cx + Math.cos(angle) * petalSize * 0.65;
        const py = cy + Math.sin(angle) * petalSize * 0.65;
        rc.ctx.beginPath();
        rc.ctx.ellipse(px, py, petalSize * 0.35, petalSize * 0.14, angle, 0, Math.PI * 2);
        rc.ctx.fill();
      }
    }

    // Center
    rc.ctx.fillStyle = '#5d4037';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
    rc.ctx.fill();
    // Seeds pattern
    rc.ctx.fillStyle = '#4e342e';
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      rc.ctx.beginPath();
      rc.ctx.arc(cx + Math.cos(a) * size * 0.15, cy + Math.sin(a) * size * 0.15, size * 0.05, 0, Math.PI * 2);
      rc.ctx.fill();
    }
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
