import { isServer } from './isServer';

export type Theme = 'DARK' | 'LIGHT';

export const ThemeClasses: Record<Theme, string> = {
  DARK: 'dark-mode',
  LIGHT: 'light-mode',
};

export const SYSTEM_THEME_MATCHER = '(prefers-color-scheme: dark)';
export const STORAGE_KEY = 'user-theme';

export function setThemeClass(theme: Theme) {
  // eslint-disable-next-line no-useless-return
  if (isServer()) return;

  if (theme === 'DARK') {
    document.body.classList.add(ThemeClasses.DARK);
  } else {
    document.body.classList.remove(ThemeClasses.DARK);
  }
}

export function getTheme(): Theme {
  const storage = localStorage.getItem(STORAGE_KEY);
  if (storage) return storage as Theme;

  const systemTheme = isServer()
    ? window.matchMedia(SYSTEM_THEME_MATCHER)
    : null;

  if (systemTheme?.matches) {
    return 'DARK';
  }
  return 'LIGHT';
}

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  setThemeClass(theme);
}

export function getNewTheme(oldTheme: Theme): Theme {
  return oldTheme === 'LIGHT' ? 'DARK' : 'LIGHT';
}
