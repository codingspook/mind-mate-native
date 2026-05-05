import { authClient, type AuthSession } from '@/lib/auth-client';
import { createContext, type ReactNode, useContext } from 'react';

interface SessionContextType {
  session: AuthSession | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <SessionContext.Provider value={{ session: session ?? null, isLoading: isPending }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
