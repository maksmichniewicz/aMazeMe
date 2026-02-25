import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

export const TreasureItem: ItemTypeDefinition = {
  typeId: 'treasure',
  displayName: 'Treasure',
  description: 'Hidden treasure to find',
  isPaired: false,

  render(rc: RenderContext, cellRect: CellRect, _item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const size = rc.cellSize * 0.3;

    // Glow behind chest
    rc.ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy, size * 1.3, 0, Math.PI * 2);
    rc.ctx.fill();

    // Chest body
    rc.ctx.fillStyle = '#8d6e63';
    const bodyW = size * 1.8;
    const bodyH = size * 0.9;
    rc.ctx.fillRect(cx - bodyW / 2, cy - bodyH * 0.1, bodyW, bodyH);

    // Chest body border
    rc.ctx.strokeStyle = '#5d4037';
    rc.ctx.lineWidth = 1.5;
    rc.ctx.strokeRect(cx - bodyW / 2, cy - bodyH * 0.1, bodyW, bodyH);

    // Metal bands
    rc.ctx.fillStyle = '#a1887f';
    rc.ctx.fillRect(cx - bodyW / 2, cy + bodyH * 0.3, bodyW, bodyH * 0.1);

    // Chest lid (opened, showing gold)
    rc.ctx.fillStyle = '#6d4c41';
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx - bodyW / 2, cy - bodyH * 0.1);
    rc.ctx.lineTo(cx - bodyW * 0.53, cy - bodyH * 0.55);
    rc.ctx.quadraticCurveTo(cx, cy - bodyH * 0.9, cx + bodyW * 0.53, cy - bodyH * 0.55);
    rc.ctx.lineTo(cx + bodyW / 2, cy - bodyH * 0.1);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#4e342e';
    rc.ctx.lineWidth = 1.5;
    rc.ctx.stroke();

    // Gold lock clasp
    rc.ctx.fillStyle = '#fdd835';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - bodyH * 0.1, size * 0.15, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.strokeStyle = '#f9a825';
    rc.ctx.lineWidth = 1;
    rc.ctx.stroke();

    // Gold coins visible inside
    rc.ctx.fillStyle = '#ffc107';
    rc.ctx.beginPath();
    rc.ctx.arc(cx - size * 0.3, cy - bodyH * 0.4, size * 0.15, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.fillStyle = '#ffca28';
    rc.ctx.beginPath();
    rc.ctx.arc(cx + size * 0.15, cy - bodyH * 0.45, size * 0.13, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.fillStyle = '#ffd54f';
    rc.ctx.beginPath();
    rc.ctx.arc(cx - size * 0.05, cy - bodyH * 0.5, size * 0.11, 0, Math.PI * 2);
    rc.ctx.fill();

    // Sparkle
    rc.ctx.fillStyle = '#fff9c4';
    rc.ctx.beginPath();
    rc.ctx.arc(cx + size * 0.4, cy - bodyH * 0.6, size * 0.06, 0, Math.PI * 2);
    rc.ctx.fill();
  },
};
