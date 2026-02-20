import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

const KEY_COLORS = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

export const KeyItem: ItemTypeDefinition = {
  typeId: 'key',
  displayName: 'Klucz',
  description: 'Otwiera sparowane drzwi',
  isPaired: true,
  pairedWithTypeId: 'door',

  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const size = rc.cellSize * 0.3;
    const color = KEY_COLORS[item.colorIndex % KEY_COLORS.length];

    // Background circle for visibility
    rc.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy, size * 1.1, 0, Math.PI * 2);
    rc.ctx.fill();

    // Key head (ring)
    rc.ctx.strokeStyle = color;
    rc.ctx.lineWidth = 3;
    rc.ctx.fillStyle = color;
    rc.ctx.globalAlpha = 0.2;
    rc.ctx.beginPath();
    rc.ctx.arc(cx - size * 0.25, cy - size * 0.15, size * 0.4, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.globalAlpha = 1;
    rc.ctx.beginPath();
    rc.ctx.arc(cx - size * 0.25, cy - size * 0.15, size * 0.4, 0, Math.PI * 2);
    rc.ctx.stroke();

    // Key shaft
    rc.ctx.lineWidth = 3;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx + size * 0.05, cy + size * 0.1);
    rc.ctx.lineTo(cx + size * 0.7, cy + size * 0.1);
    rc.ctx.stroke();

    // Key teeth
    rc.ctx.lineWidth = 2.5;
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx + size * 0.4, cy + size * 0.1);
    rc.ctx.lineTo(cx + size * 0.4, cy + size * 0.35);
    rc.ctx.stroke();
    rc.ctx.beginPath();
    rc.ctx.moveTo(cx + size * 0.6, cy + size * 0.1);
    rc.ctx.lineTo(cx + size * 0.6, cy + size * 0.3);
    rc.ctx.stroke();
  },
};
