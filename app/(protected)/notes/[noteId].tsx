import { NoteMetadata } from '@/components/note-metadata';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Note } from '@/lib/models';
import { NoteFormData, noteSchema } from '@/lib/validations/note';
import { useNotes } from '@/providers/notes-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Loader2, Save, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm, type ControllerRenderProps } from 'react-hook-form';
import { Pressable, ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

export default function NoteDetail() {
  const { noteId: noteIdParam } = useLocalSearchParams<{ noteId: string | string[] }>();
  const noteId = typeof noteIdParam === 'string' ? noteIdParam : noteIdParam?.[0];
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<NoteFormData>({
    defaultValues: {
      title: '',
      content: '',
    },
    resolver: zodResolver(noteSchema),
  });

  const { getNote, deleteNote, updateNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadNote() {
      if (!noteId) return;
      setLoading(true);
      const n = await getNote(noteId);
      if (!cancelled) {
        setNote(n);
        setValue('title', n?.title || '');
        setValue('content', n?.content || '');
        setLoading(false);
      }
    }
    void loadNote();
    return () => {
      cancelled = true;
    };
  }, [noteId]); // eslint-disable-line react-hooks/exhaustive-deps -- reload solo al cambio route

  const handleDelete = async () => {
    if (!noteId) return;
    setDeleting(true);
    await deleteNote(noteId);
    toast.success('Nota eliminata con successo');
    router.back();
    setDeleting(false);
  };

  const onSubmit = async (data: NoteFormData) => {
    if (!noteId) return;
    setSaving(true);
    await updateNote(noteId, data);
    toast.success('Nota aggiornata con successo');
    setSaving(false);
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-4 px-6 pb-4">
        <Pressable
          className="mr-auto flex-row items-center gap-1 active:opacity-60"
          onPress={() => router.back()}>
          <Icon as={ChevronLeft} className="size-5 text-foreground" />
          <Text>Torna alla lista</Text>
        </Pressable>

        {loading ? (
          <Skeleton className="h-[31px] w-[81px]" />
        ) : (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Pressable className="flex-row items-center gap-2 active:opacity-60">
                <Icon as={Trash2} className="size-[18px] text-foreground" />
                <Text>Elimina</Text>
              </Pressable>
            </AlertDialogTrigger>
            <AlertDialogContent className="h-full justify-center border-0 bg-transparent p-0 px-2 py-safe-offset-4">
              {!deleting ? (
                <Pressable className="absolute inset-0" onPress={() => setOpen(false)} />
              ) : null}
              <Card className="gap-4 p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle>Sicuro di voler eliminare questa nota?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. La nota verrà eliminata in modo
                    permanente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="w-full flex-row gap-4">
                  <AlertDialogCancel className="flex-1" disabled={deleting}>
                    <Text>Annulla</Text>
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    className="flex-1 flex-row items-center justify-center"
                    onPress={() => void handleDelete()}
                    disabled={deleting}>
                    {deleting ? (
                      <Icon
                        as={Loader2}
                        className="mr-2 size-4 animate-spin text-destructive-foreground"
                      />
                    ) : (
                      <Icon
                        as={Trash2}
                        className="mr-2 size-4 text-destructive-foreground"
                      />
                    )}
                    <Text>Elimina</Text>
                  </Button>
                </AlertDialogFooter>
              </Card>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {loading ? (
          <Skeleton className="h-[31px] w-[81px]" />
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="flex-row items-center gap-2 active:opacity-60"
            disabled={saving || isSubmitting}
            onPress={handleSubmit(onSubmit)}>
            <Icon as={Save} className="size-[18px] text-foreground" />
            <Text>Salva</Text>
          </Button>
        )}
      </View>
      <ScrollView className="w-full flex-1 gap-5 px-6" scrollEnabled={!loading}>
        {loading ? (
          <>
            <View
              className="pointer-events-none absolute top-0 right-0 left-0 z-50 h-screen opacity-100"
              style={{
                backgroundColor:
                  colorScheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
              }}
            />
            <View className="z-0 mt-6 flex-1 gap-2">
              <Skeleton className="mb-4 h-[30px] w-[70%]" />
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={`sk-${i}`} className="z-0 mb-4 gap-2">
                  {Array.from({ length: 10 }).map((_, j) => {
                    const randomWidth = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                    return (
                      <View key={`${i}-${j}`} style={{ width: `${randomWidth}%` }}>
                        <Skeleton className="h-[20px] rounded-md" />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </>
        ) : (
          <View>
            <NoteMetadata note={note ?? undefined} />

            <View className="bg-border mt-6 h-px" />

            <View className="mt-4 flex-1 pb-safe-offset-4">
              <View className="flex-1 pb-28">
                <Controller
                  control={control}
                  name="title"
                  render={({
                    field: { onChange, onBlur, value },
                  }: {
                    field: ControllerRenderProps<NoteFormData, 'title'>;
                  }) => (
                    <Textarea
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="mb-4 min-h-0 border-0 bg-transparent p-0 !outline-none font-bold"
                      placeholder="Titolo della nota"
                      style={{ fontSize: 24 }}
                      numberOfLines={1000}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="content"
                  render={({
                    field: { onChange, onBlur, value },
                  }: {
                    field: ControllerRenderProps<NoteFormData, 'content'>;
                  }) => (
                    <Textarea
                      scrollEnabled={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="border-0 bg-transparent p-0 !outline-none"
                      placeholder="Scrivi i tuoi pensieri qui..."
                      numberOfLines={1000}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
