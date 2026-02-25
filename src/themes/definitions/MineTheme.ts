import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const MineTheme: ThemeConfig = {
  id: 'mine',
  name: 'Mine',
  description: 'Gray rocks, pebbles, minerals',

  drawBackground(rc: RenderContext) {
    const p = rc.padding;
    const gw = rc.canvasWidth - p * 2;
    const gh = rc.canvasHeight - p * 2;
    rc.ctx.fillStyle = '#5a4a3a';
    rc.ctx.fillRect(p, p, gw, gh);
  },

  drawPath(rc: RenderContext, cellRect: CellRect) {
    rc.ctx.fillStyle = '#c8c0b8';
    rc.ctx.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
  },

  drawPathDecoration(rc: RenderContext, cellRect: CellRect, random: SeededRandom) {
    const r = random.next();
    if (r < 0.08) {
      // Small mineral sparkle (ore vein)
      const cx = cellRect.x + cellRect.width * (0.3 + random.next() * 0.4);
      const cy = cellRect.y + cellRect.height * (0.3 + random.next() * 0.4);
      const s = rc.cellSize * 0.06;
      const colors = ['#a08050', '#c0a060', '#8a7a6a'];
      const color = colors[Math.floor(random.next() * colors.length)];
      rc.ctx.fillStyle = color;
      rc.ctx.beginPath();
      rc.ctx.moveTo(cx, cy - s);
      rc.ctx.lineTo(cx + s * 0.7, cy);
      rc.ctx.lineTo(cx, cy + s);
      rc.ctx.lineTo(cx - s * 0.7, cy);
      rc.ctx.closePath();
      rc.ctx.fill();
    } else if (r < 0.15) {
      // Small rocks / pebbles on the ground
      const count = 2 + Math.floor(random.next() * 3);
      for (let i = 0; i < count; i++) {
        const px = cellRect.x + cellRect.width * (0.15 + random.next() * 0.7);
        const py = cellRect.y + cellRect.height * (0.15 + random.next() * 0.7);
        const pr = rc.cellSize * (0.02 + random.next() * 0.03);
        const gray = Math.floor(150 + random.next() * 40);
        rc.ctx.fillStyle = `rgb(${gray}, ${gray - 5}, ${gray - 10})`;
        rc.ctx.beginPath();
        rc.ctx.arc(px, py, pr, 0, Math.PI * 2);
        rc.ctx.fill();
      }
    }
  },

  drawWall(rc: RenderContext, from: Point, to: Point) {
    // Brown earth/wood wall
    rc.ctx.strokeStyle = '#6b4226';
    rc.ctx.lineWidth = 4;
    rc.ctx.lineCap = 'square';
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();

    // Lighter brown highlight
    rc.ctx.strokeStyle = '#8b5e3c';
    rc.ctx.lineWidth = 1;
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
    rc.ctx.fillText('\u26CF\uFE0F', cx, cy);
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83D\uDC8E', cx, cy);
  },

};
