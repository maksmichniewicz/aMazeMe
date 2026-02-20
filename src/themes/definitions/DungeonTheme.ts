import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const DungeonTheme: ThemeConfig = {
  id: 'dungeon',
  name: 'Podziemia',
  description: 'Kamienne ściany, pochodnie, pajęczyny',

  drawBackground(rc: RenderContext) {
    const p = rc.padding;
    const gw = rc.canvasWidth - p * 2;
    const gh = rc.canvasHeight - p * 2;
    rc.ctx.fillStyle = '#40405a';
    rc.ctx.fillRect(p, p, gw, gh);
  },

  drawPath(rc: RenderContext, cellRect: CellRect) {
    rc.ctx.fillStyle = '#5c5548';
    rc.ctx.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
  },

  drawPathDecoration(rc: RenderContext, cellRect: CellRect, random: SeededRandom) {
    const r = random.next();
    if (r < 0.1) {
      // Cobweb in corner — thicker, more visible
      const corners = [
        { x: cellRect.x + 2, y: cellRect.y + 2 },
        { x: cellRect.x + cellRect.width - 2, y: cellRect.y + 2 },
      ];
      const corner = corners[Math.floor(random.next() * corners.length)];
      const size = rc.cellSize * 0.3;

      rc.ctx.strokeStyle = 'rgba(220, 220, 230, 0.7)';
      rc.ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI) / 8;
        rc.ctx.beginPath();
        rc.ctx.moveTo(corner.x, corner.y);
        rc.ctx.lineTo(corner.x + Math.cos(angle) * size, corner.y + Math.sin(angle) * size);
        rc.ctx.stroke();
      }
      // Web arcs
      for (let j = 1; j <= 3; j++) {
        rc.ctx.beginPath();
        rc.ctx.arc(corner.x, corner.y, size * j * 0.3, 0, Math.PI / 2.5);
        rc.ctx.stroke();
      }
    } else if (r < 0.14) {
      // Floor crack
      const cx = cellRect.x + cellRect.width * 0.3;
      const cy = cellRect.y + cellRect.height * 0.5;
      rc.ctx.strokeStyle = 'rgba(160, 150, 130, 0.5)';
      rc.ctx.lineWidth = 0.8;
      rc.ctx.beginPath();
      rc.ctx.moveTo(cx, cy);
      rc.ctx.lineTo(cx + rc.cellSize * 0.2, cy + rc.cellSize * 0.1);
      rc.ctx.lineTo(cx + rc.cellSize * 0.35, cy - rc.cellSize * 0.05);
      rc.ctx.stroke();
    }
  },

  drawWall(rc: RenderContext, from: Point, to: Point) {
    // Stone wall — light gray
    rc.ctx.strokeStyle = '#9898a8';
    rc.ctx.lineWidth = 4;
    rc.ctx.lineCap = 'square';
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();

    // Lighter stone texture line
    rc.ctx.strokeStyle = '#aeaebe';
    rc.ctx.lineWidth = 1;
    rc.ctx.beginPath();
    rc.ctx.moveTo(from.x, from.y);
    rc.ctx.lineTo(to.x, to.y);
    rc.ctx.stroke();
  },

  drawEntrance(rc: RenderContext, cellRect: CellRect) {
    // Ornate torch
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.2;

    // Torch bracket
    rc.ctx.fillStyle = '#9a9a9a';
    rc.ctx.fillRect(cx - s * 0.15, cy + s * 0.2, s * 0.3, s * 0.4);

    // Handle
    rc.ctx.fillStyle = '#6d4c41';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.25, cy + s * 1.2);
    rc.ctx.lineTo(cx + s * 0.25, cy + s * 1.2);
    rc.ctx.lineTo(cx + s * 0.15, cy - s * 0.3);
    rc.ctx.lineTo(cx - s * 0.15, cy - s * 0.3);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#5d4037';
    rc.ctx.lineWidth = 1;
    rc.ctx.stroke();

    // Outer glow
    const glow = rc.ctx.createRadialGradient(cx, cy - s * 1, 0, cx, cy - s * 1, s * 2);
    glow.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glow.addColorStop(1, 'rgba(255, 200, 50, 0)');
    rc.ctx.fillStyle = glow;
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - s * 1, s * 2, 0, Math.PI * 2);
    rc.ctx.fill();

    // Flame body
    const flameGrad = rc.ctx.createRadialGradient(cx, cy - s * 0.7, 0, cx, cy - s * 0.7, s * 0.9);
    flameGrad.addColorStop(0, '#fff9c4');
    flameGrad.addColorStop(0.3, '#ffeb3b');
    flameGrad.addColorStop(0.7, '#ff9800');
    flameGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');
    rc.ctx.fillStyle = flameGrad;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy - s * 1.8);
    rc.ctx.quadraticCurveTo(cx + s * 0.8, cy - s * 0.8, cx + s * 0.4, cy - s * 0.2);
    rc.ctx.lineTo(cx - s * 0.4, cy - s * 0.2);
    rc.ctx.quadraticCurveTo(cx - s * 0.8, cy - s * 0.8, cx, cy - s * 1.8);
    rc.ctx.fill();
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    // Stone staircase going down
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const s = rc.cellSize * 0.3;

    // Archway
    rc.ctx.fillStyle = '#1f1f35';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - s * 0.2, s * 0.8, Math.PI, 0);
    rc.ctx.lineTo(cx + s * 0.8, cy + s * 0.9);
    rc.ctx.lineTo(cx - s * 0.8, cy + s * 0.9);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Arch border
    rc.ctx.strokeStyle = '#aeaebe';
    rc.ctx.lineWidth = 2;
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - s * 0.2, s * 0.8, Math.PI, 0);
    rc.ctx.stroke();
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.8, cy - s * 0.2);
    rc.ctx.lineTo(cx - s * 0.8, cy + s * 0.9);
    rc.ctx.stroke();
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx + s * 0.8, cy - s * 0.2);
    rc.ctx.lineTo(cx + s * 0.8, cy + s * 0.9);
    rc.ctx.stroke();

    // Steps (3 steps receding)
    const stepColors = ['#7a7a8a', '#686878', '#565668'];
    for (let i = 0; i < 3; i++) {
      const sy = cy + s * 0.15 + i * s * 0.25;
      const sw = s * (0.65 - i * 0.1);
      rc.ctx.fillStyle = stepColors[i];
      rc.ctx.fillRect(cx - sw, sy, sw * 2, s * 0.22);
      // Step edge highlight
      rc.ctx.strokeStyle = '#9a9aaa';
      rc.ctx.lineWidth = 0.8;
      rc.ctx.beginPath();
      rc.ctx.moveTo(cx - sw, sy);
      rc.ctx.lineTo(cx + sw, sy);
      rc.ctx.stroke();
    }

    // Keystone at top of arch
    rc.ctx.fillStyle = '#9a9aaa';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.12, cy - s * 0.95);
    rc.ctx.lineTo(cx + s * 0.12, cy - s * 0.95);
    rc.ctx.lineTo(cx + s * 0.08, cy - s * 0.7);
    rc.ctx.lineTo(cx - s * 0.08, cy - s * 0.7);
    rc.ctx.closePath();
    rc.ctx.fill();
  },

  printVariant: {
    drawBackground() { },
    drawPath() { },
    drawPathDecoration() { },
    drawWall(rc: RenderContext, from: Point, to: Point) {
      rc.ctx.strokeStyle = '#000000';
      rc.ctx.lineWidth = 2;
      rc.ctx.lineCap = 'square';
      rc.ctx.beginPath();
      rc.ctx.moveTo(from.x, from.y);
      rc.ctx.lineTo(to.x, to.y);
      rc.ctx.stroke();
    },
  },
};
