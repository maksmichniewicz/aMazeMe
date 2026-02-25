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

    // Treasure emoji
    rc.ctx.font = `${rc.cellSize * 0.55}px serif`;
    rc.ctx.textAlign = 'center';
    rc.ctx.textBaseline = 'middle';
    rc.ctx.fillText('\uD83C\uDF81', cx, cy + rc.cellSize * 0.02);
  },
};
