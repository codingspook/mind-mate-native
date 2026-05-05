import LoginForm from '@/components/login-form';
import { View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="mt-safe items-center justify-center p-4 py-8 sm:flex-1 sm:p-6 sm:py-4">
      <View className="w-full max-w-sm">
        <LoginForm />
      </View>
    </View>
  );
}
