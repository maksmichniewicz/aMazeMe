import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const GardenTheme: ThemeConfig = {
  id: 'garden',
  name: 'Garden',
  description: 'Hedges, flowers, butterflies',

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
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83D\uDEB6\u200D\u27A1\uFE0F', cx, cy);
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83C\uDF3B', cx, cy);
  },

};
