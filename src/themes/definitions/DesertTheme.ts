import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const DesertTheme: ThemeConfig = {
  id: 'desert',
  name: 'Desert',
  description: 'Sand, pyramids, cacti',

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
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.save();
    rc.ctx.translate(cx, cy);
    rc.ctx.scale(-1, 1);
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83D\uDC2A', 0, 0);
    rc.ctx.restore();
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83C\uDFDD\uFE0F', cx, cy);
  },

};
