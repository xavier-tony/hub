import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private loadedThemes: Record<string, boolean> = {};
  private themeQuery!: MediaQueryList;

  constructor() {
    this.initializeThemeListener();
  }

  async loadTheme(themeName: string): Promise<void> {
    if (this.loadedThemes[themeName]) {
      this.applyTheme(themeName);
      return;
    }

    try {
      const themePath = `path/to/theme-${themeName}.css`;
      const theme = await this.loadThemeFile(themePath);
      document.head.appendChild(theme);

      this.loadedThemes[themeName] = true;
      this.applyTheme(themeName);
    } catch (error) {
      console.error(`Failed to load theme: ${themeName}`, error);
    }
  }

  private initializeThemeListener(): void {
    this.themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.themeQuery.addEventListener('change', (event) => {
      const newTheme = event.matches ? 'dark' : 'light';
      this.loadTheme(newTheme);
      // Optionally, add tracking or analytics here
    });

    // Load initial theme based on user preference
    this.loadTheme(this.themeQuery.matches ? 'dark' : 'light');
  }

  private async loadThemeFile(path: string): Promise<HTMLLinkElement> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error(`Theme file load failed: ${path}`));
      document.head.appendChild(link);
    });
  }

  private applyTheme(themeName: string): void {
    // Logic to activate the theme
    console.log(`Theme applied: ${themeName}`);
  }
}
