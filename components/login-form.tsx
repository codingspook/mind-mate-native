import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email non valida').min(1, 'Il campo email è obbligatorio'),
  password: z.string().min(1, 'Il campo password è obbligatorio'),
});

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  async function signInWithEmail(data: { email: string; password: string }) {
    setLoading(true);
    setError('');
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (result.error) {
      setError(result.error.message ?? 'Accesso non riuscito');
      setLoading(false);
      return;
    }
    router.replace('/');
    setLoading(false);
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Accedi</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Bentornato! Accedi per continuare
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="nome@esempio.com"
                    textContentType="emailAddress"
                    error={!!errors.email}
                  />
                )}
              />
              {errors.email ? (
                <Text className="text-destructive text-sm">{errors.email.message}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Password"
                    textContentType="password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={!!errors.password}
                  />
                )}
              />
              {errors.password ? (
                <Text className="text-destructive text-sm">{errors.password.message}</Text>
              ) : null}
            </View>
            {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
            <Button
              className={cn('w-full', isSubmitting || loading ? 'opacity-50' : '')}
              disabled={isSubmitting || loading}
              onPress={handleSubmit(signInWithEmail)}>
              <Text>{isSubmitting || loading ? 'Accesso...' : 'Continua'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
