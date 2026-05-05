import '@/global.css';

import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { NAV_THEME } from '@/lib/theme';
import { BottomSheetProvider } from '@/providers/bottom-sheet-provider';
import { SessionProvider } from '@/providers/session-provider';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { Uniwind, useUniwind } from 'uniwind';

export { ErrorBoundary } from 'expo-router';

/* const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect; */

export default function RootLayout() {
  const { theme } = useUniwind();
  const hasMounted = React.useRef(false);

  /* useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.classList.add('bg-background');
    }
    hasMounted.current = true;
  }, []); */

  React.useEffect(() => {
    void setAndroidNavigationBar(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const navigationTheme = NAV_THEME[theme ?? 'light'];

  return (
    <ThemeProvider value={navigationTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaListener
            onChange={({ insets }) => {
              Uniwind.updateInsets(insets);
            }}>
            <SessionProvider>
              <BottomSheetProvider>
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                <View className="bg-background flex-1">
                  <Slot />
                </View>
              </BottomSheetProvider>
            </SessionProvider>
            <PortalHost />
            <Toaster offset={100} position="bottom-center" />
          </SafeAreaListener>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
