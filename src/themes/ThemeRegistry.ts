import type { ThemeConfig } from './types';

class ThemeRegistry {
  private themes: Map<string, ThemeConfig> = new Map();

  register(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme);
  }

  get(id: string): ThemeConfig | undefined {
    return this.themes.get(id);
  }

  getAll(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  getIds(): string[] {
    return Array.from(this.themes.keys());
  }
}

export const themeRegistry = new ThemeRegistry();
