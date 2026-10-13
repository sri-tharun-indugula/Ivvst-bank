import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'novabank_theme';
  readonly currentTheme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem(this.THEME_KEY, theme);
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: AppTheme): void {
    this.currentTheme.set(theme);
  }

  private getInitialTheme(): AppTheme {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_KEY) as AppTheme | null;
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }
}
