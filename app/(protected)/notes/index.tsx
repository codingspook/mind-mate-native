import { FlatList, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Link } from 'expo-router';

const notes = [
  {
    id: '43aefb48-df4d-4fa8-a4f1-a89f35c95ac3',
    title: 'Note 1',
    created_at: '2026-03-16 14:18:01',
  },
  {
    id: '43aefb48-df4d-4fa8-a4f1-a89f35c95ac4',
    title: 'Note 2',
    created_at: '2026-03-16 14:18:01',
  },
  {
    id: '43aefb48-df4d-4fa8-a4f1-a89f35c95ac5',
    title: 'Note 3',
    created_at: '2026-03-16 14:18:01',
  },
];

export default function NotesIndex() {
  return (
    <View className="flex-1 p-6">
      <FlatList
        ListHeaderComponent={() => (
          <Text variant="h2" className="border-0">
            All Notes
          </Text>
        )}
        ListHeaderComponentClassName="mb-4"
        ItemSeparatorComponent={() => <Separator className="my-4" />}
        data={notes}
        renderItem={({ item }) => (
          <Link href={`/notes/${item.id}`}>
            <View className="w-full flex-row items-center justify-between gap-4">
              <View className="flex-1 gap-2">
                <Text variant="large" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text variant="muted">
                  {item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy') : ''}
                </Text>
              </View>
              <Icon as={ChevronRight} />
            </View>
          </Link>
        )}
      />
    </View>
  );
}
