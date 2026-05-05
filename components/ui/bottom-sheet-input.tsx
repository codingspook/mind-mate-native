import { Input, type InputProps } from '@/components/ui/input';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { TextInput, type NativeSyntheticEvent, type TextInputFocusEventData } from 'react-native';

const BottomSheetInputComponent = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  InputProps
>(({ onFocus, onBlur, ...rest }, ref) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = React.useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      onFocus?.(args);
    },
    [onFocus, shouldHandleKeyboardEvents]
  );

  const handleOnBlur = React.useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      onBlur?.(args);
    },
    [onBlur, shouldHandleKeyboardEvents]
  );

  React.useEffect(() => {
    return () => {
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);

  return <Input ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />;
});

BottomSheetInputComponent.displayName = 'BottomSheetInput';

const BottomSheetInput = React.memo(BottomSheetInputComponent);

export { BottomSheetInput };
