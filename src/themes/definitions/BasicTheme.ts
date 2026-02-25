import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const BasicTheme: ThemeConfig = {
  id: 'basic',
  name: 'Basic',
  description: 'Black lines on white background',

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
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83C\uDFC3\u200D\u27A1\uFE0F', cx, cy);
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    rc.ctx.font = `${rc.cellSize * 0.6}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\u2B50', cx, cy);
  },
};
