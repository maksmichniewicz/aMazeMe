import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const BasicTheme: ThemeConfig = {
  id: 'basic',
  name: 'Podstawowy',
  description: 'Czarne linie na białym tle',

  drawBackground(_rc: RenderContext) {
    // White background — handled by renderer
  },

  drawPath(_rc: RenderContext, _cellRect: CellRect) {
    // White background is already drawn
  },

  drawPathDecoration(_rc: RenderContext, _cellRect: CellRect, _random: SeededRandom) {
    // No decorations in basic theme
  },

  drawWall(rc: RenderContext, from: Point, to: Point) {
    rc.ctx.strokeStyle = '#000000';
    rc.ctx.lineWidth = 2;
    rc.ctx.lineCap = 'round';
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();
  },

  drawEntrance(rc: RenderContext, cellRect: CellRect) {
    // Stick figure
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.3;

    rc.ctx.strokeStyle = '#22c55e';
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
    // 5-pointed star
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.3;
    const outerR = s * 0.85;
    const innerR = s * 0.35;

    rc.ctx.fillStyle = '#eab308';
    rc.ctx.strokeStyle = '#b45309';
    rc.ctx.lineWidth = 1.5;
    rc.ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const px = cx + Math.cos(angle) * r;
      const py = cy - s * 0.1 + Math.sin(angle) * r;
      if (i === 0) rc.ctx.moveTo(px, py);
      else rc.ctx.lineTo(px, py);
    }
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.stroke();

  },
};
