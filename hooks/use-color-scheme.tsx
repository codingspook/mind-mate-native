import { Uniwind, useUniwind } from 'uniwind';

export function useColorScheme() {
  const { theme } = useUniwind();
  const colorScheme = theme === 'dark' ? 'dark' : 'light';

  return {
    colorScheme,
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme: (scheme: 'light' | 'dark') => {
      Uniwind.setTheme(scheme);
    },
    toggleColorScheme: () => {
      Uniwind.setTheme(colorScheme === 'dark' ? 'light' : 'dark');
    },
  };
}
