import { ThemeToggle } from '@/components/theme-toggle';
import { Icon } from '@/components/ui/icon';
import { UserMenu } from '@/components/user-menu';
import { Stack } from 'expo-router';
import { BrainCircuit } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export default function ProtectedLayout() {
  const { theme } = useUniwind();
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          paddingTop: insets.top,
        },
        header: () => (
          <View className="flex-row items-center justify-between px-6">
            <Icon as={BrainCircuit} size={26} />
            <View className="flex-row items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </View>
          </View>
        ),
      }}
    />
  );
}
