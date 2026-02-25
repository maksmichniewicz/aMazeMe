import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

const KEY_COLORS = [
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
const KEY_MONO_COLOR = '#999999';

// Symbols for symbol mode (up to 10) — must match DoorItem PAIR_SYMBOLS
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

export const KeyItem: ItemTypeDefinition = {
  typeId: 'key',
  displayName: 'Key',
  description: 'Opens paired door',
  isPaired: true,
  pairedWithTypeId: 'door',

  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const mode = rc.doorKeyMode;

    const color = mode === 'generic'
      ? KEY_MONO_COLOR
      : KEY_COLORS[item.colorIndex % KEY_COLORS.length];

    if (mode === 'numbered' && item.colorIndex >= 0) {
      // Symbol mode: symbol inside a circle
      const symbol = PAIR_SYMBOLS[item.colorIndex % PAIR_SYMBOLS.length];
      rc.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, rc.cellSize * 0.35, 0, Math.PI * 2);
      rc.ctx.fill();
      rc.ctx.fillStyle = '#444444';
      rc.ctx.font = `bold ${rc.cellSize * 0.55}px sans-serif`;
      rc.ctx.textAlign = 'center';
      rc.ctx.textBaseline = 'middle';
      rc.ctx.fillText(symbol, cx, cy);
    } else {
      // Colored/generic mode: colored ring + key emoji
      // Background circle
      rc.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, rc.cellSize * 0.35, 0, Math.PI * 2);
      rc.ctx.fill();

      // Colored ring indicator
      rc.ctx.strokeStyle = color;
      rc.ctx.lineWidth = Math.max(3, rc.cellSize * 0.06);
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, rc.cellSize * 0.35, 0, Math.PI * 2);
      rc.ctx.stroke();

      // Key emoji
      rc.ctx.font = `${rc.cellSize * 0.45}px serif`;
      rc.ctx.textAlign = 'center';
      rc.ctx.textBaseline = 'middle';
      rc.ctx.fillText('\uD83D\uDD11', cx, cy + rc.cellSize * 0.02);
    }
  },
};
