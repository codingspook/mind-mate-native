import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Note } from '@/lib/models';
import { cn } from '@/lib/utils';
import { useTags } from '@/providers/tags-provider';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, Loader2, Tag } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from '@/components/ui/icon';

interface NoteMetadataProps {
  note?: Note;
  className?: string;
}

export function NoteMetadata({ note, className }: NoteMetadataProps) {
  const { colorScheme } = useColorScheme();
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const { tags } = useTags();
  const noteTags = tags.filter((tag) =>
    note?.note_tags?.some((noteTag) => noteTag.tag_id === tag.id)
  );

  return (
    <View className={cn('gap-4', className)}>
      {!note ? (
        <View className="rounded-md bg-muted/50 p-2">
          <Text className="text-center text-sm text-muted-foreground">
            Le informazioni AI saranno disponibili dopo il salvataggio della nota
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {note.created_at && note.updated_at ? (
            <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
              <View className="flex-row items-center gap-1">
                <Icon as={Clock} className="size-3.5 text-foreground" />
                <Text className="text-xs text-muted-foreground">
                  Creata:{' '}
                  {note.created_at ? format(new Date(note.created_at), 'dd/MM/yyyy') : 'Nessuna data'}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Icon as={Clock} className="size-3.5 text-foreground" />
                <Text className="text-xs text-muted-foreground">
                  Modificata:{' '}
                  {note.updated_at ? format(new Date(note.updated_at), 'dd/MM/yyyy') : 'Nessuna data'}
                </Text>
              </View>
            </View>
          ) : null}

          <View className="flex-row flex-wrap items-start gap-4">
            <View className="flex-row items-center gap-1.5">
              <Icon as={Tag} className="size-3.5 text-foreground" />
              <Text className="text-sm text-muted-foreground">Tag AI:</Text>
            </View>
            <View className="flex-row flex-wrap gap-1.5">
              {noteTags.length > 0 ? (
                noteTags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="bg-secondary/50">
                    <Text>{tag.name}</Text>
                  </Badge>
                ))
              ) : (
                <>
                  <Skeleton className="h-[22px] w-16" />
                  <Skeleton className="h-[22px] w-16" />
                  <Skeleton className="h-[22px] w-16" />
                  <Skeleton className="h-[22px] w-16" />
                </>
              )}
            </View>
          </View>

          {note.ai_summary ? (
            <Card className="gap-0 overflow-hidden py-0">
              <Pressable
                className="flex-row cursor-pointer items-center justify-between p-4"
                onPress={() => setSummaryExpanded(!summaryExpanded)}>
                <Text className="text-sm font-medium">Riassunto AI</Text>
                {summaryExpanded ? (
                  <Icon as={ChevronUp} className="size-3.5 text-foreground" />
                ) : (
                  <Icon as={ChevronDown} className="size-3.5 text-foreground" />
                )}
              </Pressable>

              {summaryExpanded ? (
                <CardContent className="border-t border-border p-4">
                  <Text className="text-sm text-muted-foreground">{note.ai_summary}</Text>
                </CardContent>
              ) : null}
            </Card>
          ) : (
            <Skeleton className="h-[60px] flex-row items-center justify-center gap-2">
              <Icon
                as={Loader2}
                className={cn(
                  'size-3.5 animate-spin',
                  colorScheme === 'dark' ? 'text-white' : 'text-black'
                )}
              />
              <Text>Sto generando il riassunto per la tua nota...</Text>
            </Skeleton>
          )}
        </View>
      )}
    </View>
  );
}
