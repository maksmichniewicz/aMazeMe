import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

const DOOR_COLORS = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

export const DoorItem: ItemTypeDefinition = {
  typeId: 'door',
  displayName: 'Drzwi',
  description: 'Wymagają klucza aby przejść',
  isPaired: true,
  pairedWithTypeId: 'key',

  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const w = rc.cellSize * 0.5;
    const h = rc.cellSize * 0.6;
    const color = DOOR_COLORS[item.colorIndex % DOOR_COLORS.length];

    // Door frame background
    rc.ctx.fillStyle = color;
    rc.ctx.globalAlpha = 0.2;
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - h * 0.2, w / 2, Math.PI, 0);
    rc.ctx.lineTo(cx + w / 2, cy + h * 0.3);
    rc.ctx.lineTo(cx - w / 2, cy + h * 0.3);
    rc.ctx.closePath();
    rc.ctx.fill();
    rc.ctx.globalAlpha = 1;

    // Door outline (arched)
    rc.ctx.strokeStyle = color;
    rc.ctx.lineWidth = 3;
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - h * 0.2, w / 2, Math.PI, 0);
    rc.ctx.lineTo(cx + w / 2, cy + h * 0.3);
    rc.ctx.lineTo(cx - w / 2, cy + h * 0.3);
    rc.ctx.closePath();
    rc.ctx.stroke();

    // Lock body
    rc.ctx.fillStyle = color;
    rc.ctx.fillRect(cx - w * 0.14, cy - h * 0.02, w * 0.28, h * 0.2);

    // Lock shackle
    rc.ctx.strokeStyle = color;
    rc.ctx.lineWidth = 2.5;
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy - h * 0.09, w * 0.1, Math.PI, 0);
    rc.ctx.stroke();

    // Keyhole
    rc.ctx.fillStyle = 'white';
    rc.ctx.beginPath();
    rc.ctx.arc(cx, cy + h * 0.06, w * 0.04, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.fillRect(cx - w * 0.02, cy + h * 0.06, w * 0.04, h * 0.07);
  },
};
