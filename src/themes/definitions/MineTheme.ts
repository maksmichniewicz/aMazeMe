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
    // Pickaxe icon — two symmetrical blades on a diagonal handle
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.32;

    // Handle (diagonal, bottom-left to top-right)
    rc.ctx.strokeStyle = '#8B6914';
    rc.ctx.lineWidth = Math.max(2, s * 0.18);
    rc.ctx.lineCap = 'round';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.8, cy + s * 0.8);
    rc.ctx.lineTo(cx + s * 0.8, cy - s * 0.8);
    rc.ctx.stroke();

    // Head attachment point (top of handle)
    const hx = cx + s * 0.45;
    const hy = cy - s * 0.45;

    // Blade 1 — top-left (perpendicular to handle, pointing upper-left)
    rc.ctx.fillStyle = '#707078';
    rc.ctx.beginPath();
    rc.ctx.moveTo(hx, hy);
    rc.ctx.lineTo(hx - s * 1.1, hy - s * 0.5);
    rc.ctx.lineTo(hx - s * 0.7, hy - s * 0.15);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#a0a0a8';
    rc.ctx.lineWidth = 0.8;
    rc.ctx.stroke();

    // Blade 2 — bottom-right (perpendicular to handle, pointing lower-right)
    rc.ctx.fillStyle = '#606068';
    rc.ctx.beginPath();
    rc.ctx.moveTo(hx, hy);
    rc.ctx.lineTo(hx + s * 1.1, hy + s * 0.5);
    rc.ctx.lineTo(hx + s * 0.7, hy + s * 0.15);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#a0a0a8';
    rc.ctx.lineWidth = 0.8;
    rc.ctx.stroke();
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    // Diamond icon
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.3;

    // Diamond shape
    const topY = cy - s * 0.9;
    const midY = cy - s * 0.25;
    const botY = cy + s * 0.9;
    const leftX = cx - s * 0.8;
    const rightX = cx + s * 0.8;
    const topLeftX = cx - s * 0.45;
    const topRightX = cx + s * 0.45;

    // Top facet (lighter blue-white)
    rc.ctx.fillStyle = '#b8d8e8';
    rc.ctx.beginPath();
    rc.ctx.moveTo(topLeftX, topY);
    rc.ctx.lineTo(topRightX, topY);
    rc.ctx.lineTo(rightX, midY);
    rc.ctx.lineTo(leftX, midY);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Left bottom facet
    rc.ctx.fillStyle = '#7ab0d0';
    rc.ctx.beginPath();
    rc.ctx.moveTo(leftX, midY);
    rc.ctx.lineTo(cx, midY);
    rc.ctx.lineTo(cx, botY);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Right bottom facet
    rc.ctx.fillStyle = '#90c8e0';
    rc.ctx.beginPath();
    rc.ctx.moveTo(rightX, midY);
    rc.ctx.lineTo(cx, midY);
    rc.ctx.lineTo(cx, botY);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Internal facet lines
    rc.ctx.strokeStyle = '#5a90b0';
    rc.ctx.lineWidth = 0.8;
    // Horizontal divider
    rc.ctx.beginPath();
    rc.ctx.moveTo(leftX, midY);
    rc.ctx.lineTo(rightX, midY);
    rc.ctx.stroke();
    // Top center line
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, topY);
    rc.ctx.lineTo(cx, midY);
    rc.ctx.stroke();
    // Bottom center line
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, midY);
    rc.ctx.lineTo(cx, botY);
    rc.ctx.stroke();
    // Top diagonal lines
    rc.ctx.beginPath();
    rc.ctx.moveTo(topLeftX, topY);
    rc.ctx.lineTo(cx, midY);
    rc.ctx.stroke();
    rc.ctx.beginPath();
    rc.ctx.moveTo(topRightX, topY);
    rc.ctx.lineTo(cx, midY);
    rc.ctx.stroke();

    // Diamond outline
    rc.ctx.strokeStyle = '#4a80a0';
    rc.ctx.lineWidth = 1.2;
    rc.ctx.beginPath();
    rc.ctx.moveTo(topLeftX, topY);
    rc.ctx.lineTo(topRightX, topY);
    rc.ctx.lineTo(rightX, midY);
    rc.ctx.lineTo(cx, botY);
    rc.ctx.lineTo(leftX, midY);
    rc.ctx.closePath();
    rc.ctx.stroke();

    // Sparkle highlight
    rc.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    rc.ctx.beginPath();
    rc.ctx.arc(cx - s * 0.2, topY + s * 0.25, s * 0.1, 0, Math.PI * 2);
    rc.ctx.fill();
  },

};
