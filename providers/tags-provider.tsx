import {
  createTag,
  fetchTagById,
  fetchTags,
  patchTag,
  removeTag,
} from '@/lib/api/tags';
import type { Tag } from '@/lib/models';
import { useSession } from '@/providers/session-provider';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface TagsContextType {
  tags: Tag[];
  loading: boolean;
  getTags: () => Promise<Tag[]>;
  getTag: (id: string) => Promise<Tag | null>;
  addTag: (tag: Omit<Tag, 'id' | 'created_at'>) => Promise<Tag | null>;
  updateTag: (id: string, tag: Partial<Tag>) => Promise<Tag | null>;
  deleteTag: (id: string) => Promise<Tag | null>;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTags = useCallback(async () => {
    const list = await fetchTags();
    setTags(list);
    return list;
  }, []);

  const getTags = useCallback(async () => {
    return refreshTags();
  }, [refreshTags]);

  useEffect(() => {
    if (!session?.user) {
      setTags([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function loadTags() {
      setLoading(true);
      await refreshTags();
      if (!cancelled) setLoading(false);
    }
    loadTags();
    return () => {
      cancelled = true;
    };
  }, [session?.user, refreshTags]);

  const getTag = useCallback(
    async (id: string) => {
      const cached = tags.find((t) => t.id === id);
      if (cached) return cached;
      return fetchTagById(id);
    },
    [tags]
  );

  const addTag = useCallback(
    async (tag: Omit<Tag, 'id' | 'created_at'>) => {
      if (!session?.user) return null;
      const data = await createTag({ name: tag.name });
      if (data) await refreshTags();
      return data;
    },
    [session?.user, refreshTags]
  );

  const updateTag = useCallback(
    async (id: string, tag: Partial<Tag>) => {
      const data = await patchTag(id, tag);
      if (data) await refreshTags();
      return data;
    },
    [refreshTags]
  );

  const deleteTag = useCallback(
    async (id: string) => {
      const data = await removeTag(id);
      if (data) await refreshTags();
      return data;
    },
    [refreshTags]
  );

  return (
    <TagsContext.Provider
      value={{
        tags,
        loading,
        getTags,
        getTag,
        addTag,
        updateTag,
        deleteTag,
      }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
}
