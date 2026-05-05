import { NoteFormData } from '@/lib/validations/note';
import { BottomSheetScrollView, useBottomSheet } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { NotebookPen } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import Animated, { FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/icon';
import { BottomSheetInput } from '@/components/ui/bottom-sheet-input';
import { BottomSheetTextarea } from '@/components/ui/bottom-sheet-textarea';
import { Text } from '@/components/ui/text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NewNote({ bottomSheetIndex }: { bottomSheetIndex: number }) {
  const { animatedIndex, snapToIndex } = useBottomSheet();
  const { bottom } = useSafeAreaInsets();

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const {
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = useFormContext<NoteFormData>();

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(animatedIndex.value, [0, 1], [0, -40]) }],
    opacity: interpolate(animatedIndex.value, [0, 1], [1, 0]),
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(animatedIndex.value, [0, 1], [0, -40]) }],
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1]),
    paddingBottom: bottom + 45,
  }));

  useEffect(() => {
    if (bottomSheetIndex === 1) {
      titleInputRef.current?.focus();
    }
  }, [bottomSheetIndex]);

  useEffect(() => {
    if (isSubmitting) {
      titleInputRef.current?.blur();
      contentInputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isSubmitting]);

  return (
    <BottomSheetScrollView className="flex-1 px-6">
      <View className="flex-1">
        {!isSubmitted ? (
          <Animated.View entering={FadeInDown}>
            <Animated.View style={buttonAnimatedStyle}>
              <AnimatedPressable
                className="mt-3 flex-row items-center justify-center gap-3 active:opacity-50"
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (bottomSheetIndex === 0) {
                    snapToIndex(1);
                  }
                }}>
                <Icon as={NotebookPen} className="size-6 text-foreground" />
                <Text className="text-xl font-bold text-foreground">Nuova nota</Text>
              </AnimatedPressable>
            </Animated.View>
          </Animated.View>
        ) : null}
        <Animated.View style={inputAnimatedStyle} className="px-2 pt-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <BottomSheetInput
                ref={titleInputRef}
                className="mb-4 border-0 bg-transparent p-0 !outline-none font-bold"
                placeholder="Titolo della nota"
                returnKeyType="next"
                style={{ fontSize: 24 }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.title}
                onSubmitEditing={() => {
                  contentInputRef.current?.focus();
                }}
              />
            )}
          />
          {errors.title ? (
            <Text className="text-red-500">{errors.title.message}</Text>
          ) : null}
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, onBlur, value } }) => (
              <BottomSheetTextarea
                ref={contentInputRef}
                scrollEnabled={false}
                className="border-0 bg-transparent p-0 !outline-none"
                placeholder="Scrivi i tuoi pensieri qui..."
                numberOfLines={1000}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.content}
              />
            )}
          />
          {errors.content ? (
            <Text className="text-red-500">{errors.content.message}</Text>
          ) : null}
        </Animated.View>
      </View>
    </BottomSheetScrollView>
  );
}
