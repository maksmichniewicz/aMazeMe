import { itemRegistry } from './ItemRegistry';
import { KeyItem } from './definitions/KeyItem';
import { DoorItem } from './definitions/DoorItem';
import { TreasureItem } from './definitions/TreasureItem';

itemRegistry.register(KeyItem);
itemRegistry.register(DoorItem);
itemRegistry.register(TreasureItem);

export { itemRegistry } from './ItemRegistry';
export type { ItemInstance, ItemTypeDefinition } from './types';
export { placeItems } from './ItemPlacer';
export { verifyItemPlacement } from './ItemVerifier';
