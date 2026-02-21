import type { ItemTypeDefinition, ItemInstance } from '../types';
import type { CellRect, RenderContext } from '../../renderer/types';

const KEY_COLORS = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
const KEY_MONO_COLOR = '#555555';
const KEY_SYMBOL_COLOR = '#444444';

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
  displayName: 'Klucz',
  description: 'Otwiera sparowane drzwi',
  isPaired: true,
  pairedWithTypeId: 'door',

  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance) {
    const cx = cellRect.x + cellRect.width / 2;
    const cy = cellRect.y + cellRect.height / 2;
    const size = rc.cellSize * 0.3;
    const mode = rc.doorKeyMode;

    const color = mode === 'generic'
      ? KEY_MONO_COLOR
      : mode === 'numbered'
        ? KEY_SYMBOL_COLOR
        : KEY_COLORS[item.colorIndex % KEY_COLORS.length];

    if (mode === 'numbered' && item.colorIndex >= 0) {
      // Symbol mode: just the symbol, no key graphic
      const symbol = PAIR_SYMBOLS[item.colorIndex % PAIR_SYMBOLS.length];
      // Background circle
      rc.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      rc.ctx.beginPath();
      rc.ctx.arc(cx, cy, rc.cellSize * 0.35, 0, Math.PI * 2);
      rc.ctx.fill();
      // Large symbol filling the icon
      rc.ctx.fillStyle = color;
      rc.ctx.font = `bold ${rc.cellSize * 0.55}px sans-serif`;
      rc.ctx.textAlign = 'center';
      rc.ctx.textBaseline = 'middle';
      rc.ctx.fillText(symbol, cx, cy);
    } else {
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
    }
  },
};
