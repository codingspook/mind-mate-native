import { useSession } from '@/providers/session-provider';
import { Icon } from '@/components/ui/icon';
import { Redirect, Slot } from 'expo-router';
import { Loader2 } from 'lucide-react-native';
import { View } from 'react-native';

export default function AuthLayout() {
  const { isLoading, session } = useSession();
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Icon as={Loader2} className="text-foreground size-8 animate-spin" />
      </View>
    );
  }
  if (session) {
    return <Redirect href="/notes" />;
  }
  return <Slot />;
}
