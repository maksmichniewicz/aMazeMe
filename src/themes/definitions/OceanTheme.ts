import type { ThemeConfig } from '../types';
import type { CellRect, Point, RenderContext } from '../../renderer/types';
import { SeededRandom } from '../../utils/random';

export const OceanTheme: ThemeConfig = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Fale, statki, latarnie morskie',

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
    // Ship / sailing boat
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height * 0.55;
    const s = rc.cellSize * 0.28;

    // Water beneath the hull
    rc.ctx.fillStyle = 'rgba(3, 169, 244, 0.3)';
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx, cy + s * 0.55, s * 1.1, s * 0.2, 0, 0, Math.PI * 2);
    rc.ctx.fill();

    // Hull
    rc.ctx.fillStyle = '#5d4037';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.9, cy + s * 0.1);
    rc.ctx.lineTo(cx + s * 0.9, cy + s * 0.1);
    rc.ctx.lineTo(cx + s * 0.65, cy + s * 0.5);
    rc.ctx.lineTo(cx - s * 0.65, cy + s * 0.5);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Hull stripe
    rc.ctx.fillStyle = '#c62828';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.85, cy + s * 0.15);
    rc.ctx.lineTo(cx + s * 0.85, cy + s * 0.15);
    rc.ctx.lineTo(cx + s * 0.8, cy + s * 0.28);
    rc.ctx.lineTo(cx - s * 0.8, cy + s * 0.28);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Mast
    rc.ctx.strokeStyle = '#4e342e';
    rc.ctx.lineWidth = 2;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy + s * 0.1);
    rc.ctx.lineTo(cx, cy - s * 1.2);
    rc.ctx.stroke();

    // Main sail
    rc.ctx.fillStyle = '#fafafa';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx + s * 0.05, cy - s * 1.1);
    rc.ctx.quadraticCurveTo(cx + s * 0.7, cy - s * 0.5, cx + s * 0.05, cy + s * 0.05);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#bdbdbd';
    rc.ctx.lineWidth = 0.8;
    rc.ctx.stroke();

    // Small front sail (jib)
    rc.ctx.fillStyle = '#fafafa';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.05, cy - s * 1.0);
    rc.ctx.quadraticCurveTo(cx - s * 0.55, cy - s * 0.4, cx - s * 0.05, cy + s * 0.0);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#bdbdbd';
    rc.ctx.lineWidth = 0.8;
    rc.ctx.stroke();

    // Flag
    rc.ctx.fillStyle = '#1565c0';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy - s * 1.2);
    rc.ctx.lineTo(cx + s * 0.3, cy - s * 1.35);
    rc.ctx.lineTo(cx, cy - s * 1.5);
    rc.ctx.closePath();
    rc.ctx.fill();
  },

  drawExit(rc: RenderContext, cellRect: CellRect) {
    // Lighthouse
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height * 0.55;
    const s = rc.cellSize * 0.28;

    // Rocky base
    rc.ctx.fillStyle = '#78909c';
    rc.ctx.beginPath();
    rc.ctx.ellipse(cx, cy + s * 0.6, s * 0.8, s * 0.2, 0, 0, Math.PI * 2);
    rc.ctx.fill();

    // Tower body (tapered)
    rc.ctx.fillStyle = '#fafafa';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.35, cy + s * 0.5);
    rc.ctx.lineTo(cx - s * 0.2, cy - s * 0.8);
    rc.ctx.lineTo(cx + s * 0.2, cy - s * 0.8);
    rc.ctx.lineTo(cx + s * 0.35, cy + s * 0.5);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Red stripes
    rc.ctx.fillStyle = '#c62828';
    const stripeCount = 3;
    for (let i = 0; i < stripeCount; i++) {
      const t1 = (i * 2 + 1) / (stripeCount * 2 + 1);
      const t2 = (i * 2 + 2) / (stripeCount * 2 + 1);
      const y1 = cy + s * 0.5 - (cy + s * 0.5 - (cy - s * 0.8)) * t1;
      const y2 = cy + s * 0.5 - (cy + s * 0.5 - (cy - s * 0.8)) * t2;
      const w1l = s * 0.35 - (s * 0.35 - s * 0.2) * t1;
      const w1r = s * 0.35 - (s * 0.35 - s * 0.2) * t1;
      const w2l = s * 0.35 - (s * 0.35 - s * 0.2) * t2;
      const w2r = s * 0.35 - (s * 0.35 - s * 0.2) * t2;
      rc.ctx.beginPath();
      rc.ctx.moveTo(cx - w1l, y1);
      rc.ctx.lineTo(cx - w2l, y2);
      rc.ctx.lineTo(cx + w2r, y2);
      rc.ctx.lineTo(cx + w1r, y1);
      rc.ctx.closePath();
      rc.ctx.fill();
    }

    // Lantern room platform
    rc.ctx.fillStyle = '#37474f';
    rc.ctx.fillRect(cx - s * 0.3, cy - s * 0.85, s * 0.6, s * 0.08);

    // Lantern room
    rc.ctx.fillStyle = '#ffee58';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - s * 0.18, cy - s * 0.85);
    rc.ctx.lineTo(cx - s * 0.12, cy - s * 1.15);
    rc.ctx.lineTo(cx + s * 0.12, cy - s * 1.15);
    rc.ctx.lineTo(cx + s * 0.18, cy - s * 0.85);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Light glow
    rc.ctx.save();
    const glowGrad = rc.ctx.createRadialGradient(cx, cy - s * 1.0, 0, cx, cy - s * 1.0, s * 0.6);
    glowGrad.addColorStop(0, 'rgba(255, 238, 88, 0.5)');
    glowGrad.addColorStop(0.5, 'rgba(255, 238, 88, 0.15)');
    glowGrad.addColorStop(1, 'rgba(255, 238, 88, 0)');
    rc.ctx.fillStyle = glowGrad;
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - s * 1.0, s * 0.6, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.restore();

    // Roof
    rc.ctx.fillStyle = '#c62828';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx, cy - s * 1.4);
    rc.ctx.lineTo(cx - s * 0.15, cy - s * 1.15);
    rc.ctx.lineTo(cx + s * 0.15, cy - s * 1.15);
    rc.ctx.closePath();
    rc.ctx.fill();

    // Door
    rc.ctx.fillStyle = '#5d4037';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy + s * 0.3, s * 0.1, Math.PI, 0, false);
    rc.ctx.lineTo(cx + s * 0.1, cy + s * 0.5);
    rc.ctx.lineTo(cx - s * 0.1, cy + s * 0.5);
    rc.ctx.closePath();
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
