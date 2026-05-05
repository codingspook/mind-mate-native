import CustomFooter from '@/components/custom-footer';
import NewNote from '@/components/new-note';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { NoteFormData, noteSchema } from '@/lib/validations/note';
import { useBottomSheetContext } from '@/providers/bottom-sheet-provider';
import { useSession } from '@/providers/session-provider';
import { NotesProvider } from '@/providers/notes-provider';
import { TagsProvider } from '@/providers/tags-provider';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Link, Redirect, Stack, usePathname } from 'expo-router';
import { BrainCircuit, Loader2 } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

export default function ProtectedLayout() {
  const { session, isLoading } = useSession();
  const pathname = usePathname();
  const { theme } = useUniwind();
  const { top } = useSafeAreaInsets();

  const { bottomSheetRef } = useBottomSheetContext();
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0);

  useEffect(() => {
    if (pathname === '/profile') {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [pathname]);

  const handleBottomSheetChange = useCallback((index: number) => {
    setBottomSheetIndex(index);
  }, []);

  const snapPoints = useMemo(() => [100, '95%'], []);

  const form = useForm<NoteFormData>({
    defaultValues: {
      title: '',
      content: '',
    },
    resolver: zodResolver(noteSchema),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Icon as={Loader2} className="text-foreground size-8 animate-spin" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  const isDark = theme === 'dark';

  return (
    <TagsProvider>
      <NotesProvider>
        <View className="flex-1" style={{ paddingTop: top }}>
          <Stack
            screenOptions={{
              header: () => (
                <View className="flex-row items-center justify-between px-6">
                  <Icon as={BrainCircuit} className="size-[26px] text-foreground" />
                  <View className="flex-row items-center gap-2">
                    <ThemeToggle />
                    <Link href="/profile" asChild>
                      <Pressable
                        onPress={() => {
                          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}>
                        <Avatar alt="User avatar">
                          <AvatarImage
                            source={{
                              uri:
                                (session?.user as { image?: string | null } | undefined)?.image ??
                                undefined,
                            }}
                          />
                          <AvatarFallback>
                            <Text>{session?.user?.email?.charAt(0).toUpperCase()}</Text>
                          </AvatarFallback>
                        </Avatar>
                      </Pressable>
                    </Link>
                  </View>
                </View>
              ),
            }}>
            <Stack.Screen
              name="profile"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="notes/index" />
            <Stack.Screen
              name="notes/[noteId]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>

          <FormProvider {...form}>
            <BottomSheet
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPoints}
              enableDynamicSizing={false}
              onChange={handleBottomSheetChange}
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
              backgroundStyle={{
                backgroundColor: isDark ? '#272729' : '#F4F4F5',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 5,
              }}
              handleIndicatorStyle={{
                backgroundColor: isDark ? '#fff' : '#000',
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={0}
                  pressBehavior="close"
                  style={{
                    top: -top,
                    backgroundColor: isDark ? '#000' : '#fff',
                  }}
                />
              )}
              footerComponent={CustomFooter}>
              <NewNote bottomSheetIndex={bottomSheetIndex} />
            </BottomSheet>
          </FormProvider>
        </View>
      </NotesProvider>
    </TagsProvider>
  );
}
