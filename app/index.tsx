import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: 'React Native Reusables',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { theme } = useUniwind();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Image source={LOGO[theme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
        <Card className="w-full max-w-sm">
          <CardHeader className="flex-row">
            <View className="flex-1 gap-1.5">
              <CardTitle>Subscribe to our newsletter</CardTitle>
              <CardDescription>Enter your details to receive updates and tips</CardDescription>
            </View>
          </CardHeader>
          <CardContent>
            <View className="w-full justify-center gap-4">
              <View className="gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="m@example.com" />
              </View>
              <View className="gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </View>
            </View>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full">
              <Text>Subscribe</Text>
            </Button>
            <Button variant="outline" className="w-full">
              <Text>Later</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { theme } = useUniwind();

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    Uniwind.setTheme(newTheme);
  }

  return (
    <Button
      onPressIn={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 web:mx-4 rounded-full">
      <Icon as={THEME_ICONS[theme ?? 'light']} className="size-5" />
    </Button>
  );
}
