import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { NoteFormData } from '@/lib/validations/note';
import { useNotes } from '@/providers/notes-provider';
import { BottomSheetFooter, type BottomSheetFooterProps, useBottomSheet } from '@gorhom/bottom-sheet';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, Save } from 'lucide-react-native';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/icon';

const AnimatedButton = Animated.createAnimatedComponent(Button);

interface CustomFooterProps extends BottomSheetFooterProps {}

export default function CustomFooter(props: CustomFooterProps) {
  const { bottom } = useSafeAreaInsets();
  const { animatedIndex } = useBottomSheet();
  const { handleSubmit, watch, reset } = useFormContext<NoteFormData>();
  const { addNote } = useNotes();
  const { noteId } = useGlobalSearchParams<{ noteId?: string }>();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const contentValue = watch('content');
  const isContentEmpty = !contentValue || contentValue.trim().length === 0;

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(animatedIndex.value, [0, 1], [110, 0], Extrapolation.CLAMP),
        },
      ],
    }),
    [animatedIndex]
  );

  const handleCreateNewNote = async (data: NoteFormData) => {
    setIsLoading(true);
    const note = await addNote(data);
    if (note) {
      setShowSaved(true);
      setTimeout(() => {
        setShowSaved(false);
        reset();
      }, 3000);
      if (noteId) {
        router.replace(`/notes/${note.id}`);
      } else {
        router.push(`/notes/${note.id}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetFooter {...props} bottomInset={bottom}>
      <View className="relative px-6 pb-7">
        <AnimatedButton
          entering={FadeIn}
          exiting={FadeOut}
          style={containerAnimatedStyle}
          onPress={handleSubmit(handleCreateNewNote)}
          disabled={isLoading || isContentEmpty}
          className="w-full flex-row items-center justify-center gap-2">
          <Icon as={Save} className="size-4 text-primary-foreground" />
          <Text className="text-primary-foreground">{isLoading ? 'Salvando...' : 'Salva nota'}</Text>
        </AnimatedButton>
        {showSaved ? (
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            className="absolute inset-x-0 top-2 flex-row items-center justify-center gap-3">
            <View className="items-center justify-center">
              <Icon as={CheckCircle2} className="size-6 text-green-500" />
            </View>
            <Text className="text-xl font-bold text-foreground">Nota salvata</Text>
          </Animated.View>
        ) : null}
      </View>
    </BottomSheetFooter>
  );
}
