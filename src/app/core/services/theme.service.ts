import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly STORAGE_KEY = 'tripforge_theme';

  // Signal for current theme
  private readonly _theme = signal<Theme>('dark');

  readonly theme = this._theme.asReadonly();

  /** Computed: is dark mode active */
  readonly isDark = computed(() => this._theme() === 'dark');

  /** Computed: theme icon */
  readonly themeIcon = computed(() =>
    this._theme() === 'dark' ? 'bi-moon-stars-fill' : 'bi-sun-fill'
  );

  /** Computed: theme label */
  readonly themeLabel = computed(() =>
    this._theme() === 'dark' ? 'Dark Mode' : 'Light Mode'
  );

  constructor() {
    // Restore theme from localStorage
    const savedTheme = this.storage.get<Theme>(this.STORAGE_KEY);
    if (savedTheme) {
      this._theme.set(savedTheme);
    }
    // Apply theme to document immediately
    this.applyTheme(this._theme());

    // Effect: automatically apply theme changes to the DOM
    effect(() => {
      this.applyTheme(this._theme());
    });
  }

  /** Toggle between light and dark themes */
  toggle(): void {
    const newTheme: Theme = this._theme() === 'dark' ? 'light' : 'dark';
    this._theme.set(newTheme);
    this.storage.set(this.STORAGE_KEY, newTheme);
  }

  /** Set a specific theme */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.storage.set(this.STORAGE_KEY, theme);
  }

  /** Apply theme to the document element */
  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(`theme-${theme}`);
    }
  }
}
