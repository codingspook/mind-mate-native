import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function NoteDetail() {
  const { noteId } = useLocalSearchParams();
  return (
    <View>
      <Text variant="h3">{noteId}</Text>
    </View>
  );
}
