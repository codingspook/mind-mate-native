import BottomSheet from '@gorhom/bottom-sheet';
import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';

type BottomSheetContextType = {
  bottomSheetRef: React.RefObject<React.ComponentRef<typeof BottomSheet> | null>;
  openSheet: () => void;
  closeSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const bottomSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet, bottomSheetRef }}>
      {children}
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheetContext() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheetContext must be used within a BottomSheetProvider');
  }
  return context;
}
