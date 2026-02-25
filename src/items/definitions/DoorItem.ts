import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

const DOOR_COLORS = [
  '#f44336', // red
  '#2196f3', // blue
  '#4caf50', // green
  '#ff9800', // orange
  '#9c27b0', // purple
  '#00bcd4', // cyan
  '#e91e63', // pink
  '#795548', // brown
  '#607d8b', // blue grey
  '#cddc39', // lime
];
const DOOR_MONO_COLOR = '#999999';
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
  displayName: 'Door',
  description: 'Requires a key to pass',
  isPaired: true,
  pairedWithTypeId: 'key',

  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const mode = rc.doorKeyMode;

    if (mode === 'numbered' && item.colorIndex >= 0) {
      // Arched door with large symbol
      const color = DOOR_SYMBOL_COLOR;
      const w = rc.cellSize * 0.5;
      const h = rc.cellSize * 0.6;

      rc.ctx.save();
      rc.ctx.translate(cx, cy);

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

      // Large symbol filling the door
      const symbol = PAIR_SYMBOLS[item.colorIndex % PAIR_SYMBOLS.length];
      rc.ctx.fillStyle = color;
      rc.ctx.font = `bold ${rc.cellSize * 0.45}px sans-serif`;
      rc.ctx.textAlign = 'center';
      rc.ctx.textBaseline = 'middle';
      rc.ctx.fillText(symbol, 0, h * 0.02);

      rc.ctx.restore();
    } else {
      // Colored/generic mode: colored ring + door emoji
      const color = mode === 'generic'
        ? DOOR_MONO_COLOR
        : DOOR_COLORS[item.colorIndex % DOOR_COLORS.length];

      // Background circle
      rc.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, rc.cellSize * 0.38, 0, Math.PI * 2);
      rc.ctx.fill();

      // Colored ring indicator
      rc.ctx.strokeStyle = color;
      rc.ctx.lineWidth = Math.max(3, rc.cellSize * 0.06);
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, rc.cellSize * 0.38, 0, Math.PI * 2);
      rc.ctx.stroke();

      // Door emoji
      rc.ctx.font = `${rc.cellSize * 0.45}px serif`;
      rc.ctx.textAlign = 'center';
      rc.ctx.textBaseline = 'middle';
      rc.ctx.fillText('\uD83D\uDEAA', cx, cy);
    }
  },
};
