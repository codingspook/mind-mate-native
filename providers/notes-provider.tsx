import {
  createNote,
  fetchNoteById,
  fetchNotes,
  patchNote,
  removeNote,
} from '@/lib/api/notes';
import type { Note } from '@/lib/models';
import { useSession } from '@/providers/session-provider';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  getNotes: () => Promise<Note[]>;
  getNote: (id: string) => Promise<Note | null>;
  addNote: (note: Pick<Note, 'title' | 'content'>) => Promise<Note | null>;
  updateNote: (id: string, note: Partial<Note>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<Note | null>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshNotes = useCallback(async () => {
    const list = await fetchNotes();
    setNotes(list);
    return list;
  }, []);

  const getNotes = useCallback(async () => {
    return refreshNotes();
  }, [refreshNotes]);

  useEffect(() => {
    if (!session?.user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function loadNotes() {
      setLoading(true);
      await refreshNotes();
      if (!cancelled) setLoading(false);
    }
    loadNotes();
    return () => {
      cancelled = true;
    };
  }, [session?.user, refreshNotes]);

  const getNote = useCallback(
    async (id: string) => {
      const cached = notes.find((n) => n.id === id);
      if (cached) return cached;
      return fetchNoteById(id);
    },
    [notes]
  );

  const addNote = useCallback(
    async (note: Pick<Note, 'title' | 'content'>) => {
      if (!session?.user) return null;
      const data = await createNote(note);
      if (data) await refreshNotes();
      return data;
    },
    [session?.user, refreshNotes]
  );

  const updateNote = useCallback(
    async (id: string, note: Partial<Note>) => {
      const data = await patchNote(id, note);
      if (data) await refreshNotes();
      return data;
    },
    [refreshNotes]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      const data = await removeNote(id);
      if (data) await refreshNotes();
      return data;
    },
    [refreshNotes]
  );

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        getNotes,
        getNote,
        addNote,
        updateNote,
        deleteNote,
      }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
