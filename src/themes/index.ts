import { themeRegistry } from './ThemeRegistry';
import { BasicTheme } from './definitions/BasicTheme';
import { GardenTheme } from './definitions/GardenTheme';
import { DungeonTheme } from './definitions/DungeonTheme';
import { DesertTheme } from './definitions/DesertTheme';
import { OceanTheme } from './definitions/OceanTheme';

themeRegistry.register(BasicTheme);
themeRegistry.register(GardenTheme);
themeRegistry.register(DungeonTheme);
themeRegistry.register(DesertTheme);
themeRegistry.register(OceanTheme);

export { themeRegistry } from './ThemeRegistry';
export type { ThemeConfig } from './types';
