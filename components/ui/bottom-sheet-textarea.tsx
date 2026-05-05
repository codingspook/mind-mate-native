import { Textarea, type TextareaProps } from '@/components/ui/textarea';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import * as React from 'react';
import {
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';

const BottomSheetTextareaComponent = React.forwardRef<
  React.ComponentRef<typeof Textarea>,
  TextareaProps
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

  return <Textarea ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />;
});

BottomSheetTextareaComponent.displayName = 'BottomSheetTextarea';

const BottomSheetTextarea = React.memo(BottomSheetTextareaComponent);

export { BottomSheetTextarea };
