import type { ItemTypeDefinition } from './types';

class ItemRegistry {
  private items: Map<string, ItemTypeDefinition> = new Map();

  register(item: ItemTypeDefinition): void {
    this.items.set(item.typeId, item);
  }

  get(typeId: string): ItemTypeDefinition | undefined {
    return this.items.get(typeId);
  }

  getAll(): ItemTypeDefinition[] {
    return Array.from(this.items.values());
  }
}

export const itemRegistry = new ItemRegistry();
