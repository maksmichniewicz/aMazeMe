import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

const DOOR_COLORS = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
const DOOR_MONO_COLOR = '#555555';
const DOOR_SYMBOL_COLOR = '#444444';

// Symbols for numbered/symbol mode (up to 10)
const PAIR_SYMBOLS = [
  '\u25B2', // triangle up
  '\u25A0', // square
  '\u25CF', // circle
  '\u2666', // diamond
  '\u2605', // star
  '\u25BC', // triangle down
  '\u2B22', // hexagon
  '\u271A', // cross
  '\u25C6', // diamond filled
  '\u2764', // heart
];

export const DoorItem: ItemTypeDefinition = {
  typeId: 'door',
  displayName: 'Drzwi',
  description: 'Wymagają klucza aby przejść',
  isPaired: true,
  pairedWithTypeId: 'key',

  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const mode = rc.doorKeyMode;

    const color = mode === 'generic'
      ? DOOR_MONO_COLOR
      : mode === 'numbered'
        ? DOOR_SYMBOL_COLOR
        : DOOR_COLORS[item.colorIndex % DOOR_COLORS.length];

    rc.ctx.save();
    rc.ctx.translate(cx, cy);
    drawDoorAtOrigin(rc, color, mode, item);
    rc.ctx.restore();
  },
};

function drawDoorAtOrigin(
  rc: RenderContext,
  color: string,
  mode: string,
  item: ItemInstance,
) {
  const w = rc.cellSize * 0.5;
  const h = rc.cellSize * 0.6;

  // Door frame background
  rc.ctx.fillStyle = color;
  rc.ctx.globalAlpha = 0.2;
  rc.ctx.beginPath();
  rc.ctx.arc(0, -h * 0.2, w / 2, Math.PI, 0);
  rc.ctx.lineTo(w / 2, h * 0.3);
  rc.ctx.lineTo(-w / 2, h * 0.3);
  rc.ctx.closePath();
  rc.ctx.fill();
  rc.ctx.globalAlpha = 1;

  // Door outline (arched)
  rc.ctx.strokeStyle = color;
  rc.ctx.lineWidth = 3;
  rc.ctx.beginPath();
  rc.ctx.arc(0, -h * 0.2, w / 2, Math.PI, 0);
  rc.ctx.lineTo(w / 2, h * 0.3);
  rc.ctx.lineTo(-w / 2, h * 0.3);
  rc.ctx.closePath();
  rc.ctx.stroke();

  if (mode === 'numbered' && item.colorIndex >= 0) {
    // Symbol mode: large symbol filling the door arch
    const symbol = PAIR_SYMBOLS[item.colorIndex % PAIR_SYMBOLS.length];
    rc.ctx.fillStyle = color;
    rc.ctx.font = `bold ${rc.cellSize * 0.55}px sans-serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText(symbol, 0, h * 0.02);
  } else {
    // Lock body
    rc.ctx.fillStyle = color;
    rc.ctx.fillRect(-w * 0.14, -h * 0.02, w * 0.28, h * 0.2);

    // Lock shackle
    rc.ctx.strokeStyle = color;
    rc.ctx.lineWidth = 2.5;
    rc.ctx.beginPath();
    rc.ctx.arc(0, -h * 0.09, w * 0.1, Math.PI, 0);
    rc.ctx.stroke();

    // Keyhole
    rc.ctx.fillStyle = 'white';
    rc.ctx.beginPath();
    rc.ctx.arc(0, h * 0.06, w * 0.04, 0, Math.PI * 2);
    rc.ctx.fill();
    rc.ctx.fillRect(-w * 0.02, h * 0.06, w * 0.04, h * 0.07);
  }
}
