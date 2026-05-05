import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useBottomSheetContext } from '@/providers/bottom-sheet-provider';
import { useNotes } from '@/providers/notes-provider';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { format } from 'date-fns';
import { ChevronRight, Loader2, NotebookPen } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotesIndex() {
  const { openSheet } = useBottomSheetContext();
  const { bottom } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { notes, loading, getNotes } = useNotes();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getNotes();
    setRefreshing(false);
  }, [getNotes]);

  return (
    <View className="w-full flex-1 gap-5 pt-6">
      <FlashList
        data={notes}
        estimatedItemSize={72}
        extraData={loading}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100 + bottom,
        }}
        ListEmptyComponent={() => (
          <Card className="flex-1 items-center justify-center border-dashed p-7">
            <CardContent className="flex-1 items-center gap-2 text-center">
              {loading ? (
                <Icon as={Loader2} className="text-foreground size-6 animate-spin" />
              ) : null}
              <Text className="text-center text-xl font-medium text-muted-foreground">
                {loading ? 'Caricamento note...' : 'Nessuna nota trovata'}
              </Text>
              {!loading ? (
                <>
                  <Text className="mb-4 text-center text-sm text-muted-foreground">
                    Crea una nuova nota per iniziare
                  </Text>
                  <Button
                    className="flex-row gap-3"
                    onPress={() => {
                      openSheet();
                    }}>
                    <Icon as={NotebookPen} className="size-4 text-primary-foreground" />
                    <Text>Crea nuova nota</Text>
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        )}
        ListHeaderComponent={() => (
          <Text variant="h2" className="mb-4 border-0 text-4xl font-bold">
            Le tue note
          </Text>
        )}
        ItemSeparatorComponent={() => <Separator className="my-4" />}
        renderItem={({ item }) => (
          <Link
            href={`/notes/${item.id}`}
            className="w-full"
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}>
            <View className="w-full flex-row items-center justify-between gap-4">
              <View className="flex-1 gap-2">
                <Text className="truncate text-xl font-medium" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {item.created_at
                    ? format(new Date(item.created_at), 'dd/MM/yyyy')
                    : 'Nessuna data'}
                </Text>
              </View>
              <Icon as={ChevronRight} className="size-4 text-foreground" />
            </View>
          </Link>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}
