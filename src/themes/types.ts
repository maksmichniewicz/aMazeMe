import type { CellRect, Point, RenderContext } from '../renderer/types';
import { SeededRandom } from '../utils/random';
import type { ItemInstance } from '../items/types';

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;

  drawBackground(rc: RenderContext): void;
  drawPath(rc: RenderContext, cellRect: CellRect): void;
  drawPathDecoration(rc: RenderContext, cellRect: CellRect, random: SeededRandom): void;
  drawWall(rc: RenderContext, from: Point, to: Point): void;
  drawEntrance(rc: RenderContext, cellRect: CellRect): void;
  drawExit(rc: RenderContext, cellRect: CellRect): void;
  drawItem?(rc: RenderContext, cellRect: CellRect, item: ItemInstance): boolean;

  printVariant?: Partial<ThemeConfig>;
}
