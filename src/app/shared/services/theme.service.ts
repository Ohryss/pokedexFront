import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'app-theme';

  constructor() {
    const savedTheme = localStorage.getItem(this.themeKey) || 'light';
    this.applyTheme(savedTheme);
  }

  // Appliquer un thème (light/dark)
  applyTheme(theme: string): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem(this.themeKey, theme);
  }

  // Toggle entre les thèmes
  toggleTheme(): void {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  get currentTheme(): string {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
}
