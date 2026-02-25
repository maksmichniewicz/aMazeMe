import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const OceanTheme: ThemeConfig = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Waves, ships, lighthouses',

  drawBackground(rc: RenderContext) {
    const p = rc.padding;
    const gw = rc.canvasWidth - p * 2;
    const gh = rc.canvasHeight - p * 2;
    const grad = rc.ctx.createLinearGradient(p, p, p, p + gh);
    grad.addColorStop(0, '#e0f7fa');
    grad.addColorStop(0.5, '#b2ebf2');
    grad.addColorStop(1, '#80deea');
    rc.ctx.fillStyle = grad;
    rc.ctx.fillRect(p, p, gw, gh);
  },

  drawPath(rc: RenderContext, cellRect: CellRect) {
    rc.ctx.fillStyle = '#e0f7fa';
    rc.ctx.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
  },

  drawPathDecoration(rc: RenderContext, cellRect: CellRect, random: SeededRandom) {
    const r = random.next();
    if (r < 0.08) {
      // Fish
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * (0.3 + random.next() * 0.4);
      const s = rc.cellSize * 0.1;
      const colors = ['#f44336', '#ff9800', '#ffeb3b', '#ab47bc'];
      const color = colors[Math.floor(random.next() * colors.length)];

      rc.ctx.fillStyle = color;
      rc.ctx.beginPath();
      rc.ctx.ellipse(cx, cy, s, s * 0.5, 0, 0, Math.PI * 2);
      rc.ctx.fill();
      // Tail
      rc.ctx.beginPath();
      rc.ctx.moveTo(cx + s * 0.8, cy);
      rc.ctx.lineTo(cx + s * 1.5, cy - s * 0.5);
      rc.ctx.lineTo(cx + s * 1.5, cy + s * 0.5);
      rc.ctx.closePath();
      rc.ctx.fill();
      // Eye
      rc.ctx.fillStyle = '#263238';
      rc.ctx.beginPath();
      rc.ctx.arc(cx - s * 0.4, cy - s * 0.1, s * 0.12, 0, Math.PI * 2);
      rc.ctx.fill();
    } else if (r < 0.13) {
      // Bubbles
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * (0.3 + random.next() * 0.4);
      const s = rc.cellSize * 0.03;

      rc.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      rc.ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const bx = cx + (random.next() - 0.5) * rc.cellSize * 0.15;
        const by = cy - i * s * 2.5;
        const br = s * (0.6 + random.next() * 0.8);
        rc.ctx.beginPath();
        rc.ctx.arc(bx, by, br, 0, Math.PI * 2);
        rc.ctx.stroke();
      }
    } else if (r < 0.17) {
      // Seashell
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * 0.7;
      const s = rc.cellSize * 0.07;

      rc.ctx.fillStyle = '#ffccbc';
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, s, Math.PI, 0, false);
      rc.ctx.lineTo(cx + s, cy);
      rc.ctx.quadraticCurveTo(cx, cy + s * 1.2, cx - s, cy);
      rc.ctx.closePath();
      rc.ctx.fill();

      rc.ctx.strokeStyle = '#d7967a';
      rc.ctx.lineWidth = 0.5;
      for (let i = -2; i <= 2; i++) {
        rc.ctx.beginPath();
        rc.ctx.moveTo(cx + i * s * 0.3, cy - s * 0.2);
        rc.ctx.lineTo(cx + i * s * 0.4, cy + s * 0.7);
        rc.ctx.stroke();
      }
    }
  },

  drawWall(rc: RenderContext, from: Point, to: Point) {
    // Deep blue wall
    rc.ctx.strokeStyle = '#0277bd';
    rc.ctx.lineWidth = 3;
    rc.ctx.lineCap = 'round';
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();

    // Wave highlight
    rc.ctx.strokeStyle = '#4fc3f7';
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
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\u26F5', cx, cy);
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\u2693', cx, cy);
  },

};
