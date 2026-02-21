import type { Position, WallPosition } from '../core/types';
import type { CellRect, RenderContext } from '../renderer/types';

export interface ItemInstance {
  id: string;
  typeId: string;
  position: Position;
  wallPosition?: WallPosition;
  pairedItemId?: string;
  colorIndex: number;
}

export interface ItemTypeDefinition {
  typeId: string;
  displayName: string;
  description: string;
  isPaired: boolean;
  pairedWithTypeId?: string;
  render(rc: RenderContext, cellRect: CellRect, item: ItemInstance): void;
}
