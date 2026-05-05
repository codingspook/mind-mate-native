import { THEME } from '@/lib/theme';

/** Colori semantici allineati a React Navigation (stesso significato di `NAV_THEME` in `lib/theme`). */
export const NAV_THEME = {
  light: {
    background: THEME.light.background,
    border: THEME.light.border,
    card: THEME.light.card,
    notification: THEME.light.destructive,
    primary: THEME.light.primary,
    text: THEME.light.foreground,
  },
  dark: {
    background: THEME.dark.background,
    border: THEME.dark.border,
    card: THEME.dark.card,
    notification: THEME.dark.destructive,
    primary: THEME.dark.primary,
    text: THEME.dark.foreground,
  },
};
