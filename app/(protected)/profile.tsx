import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useLogout } from '@/hooks/use-logout';
import { useNotes } from '@/providers/notes-provider';
import { useSession } from '@/providers/session-provider';
import { useTags } from '@/providers/tags-provider';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

type ProfileUserFields = {
  email?: string | null;
  image?: string | null;
  createdAt?: string | Date | null;
  created_at?: string | Date | null;
};

export default function ProfileScreen() {
  const router = useRouter();

  const { session } = useSession();
  const { notes } = useNotes();
  const { tags } = useTags();
  const { logout } = useLogout();

  const profileUser = session?.user as ProfileUserFields | undefined;
  const memberSince = profileUser?.createdAt ?? profileUser?.created_at;

  const lastModifiedNote = useMemo(() => {
    return notes.reduce(
      (latest, note) => {
        if (!latest) return note;
        const noteDate = new Date(note.updated_at || note.created_at || 0);
        const latestDate = new Date(latest.updated_at || latest.created_at || 0);
        return noteDate > latestDate ? note : latest;
      },
      null as (typeof notes)[0] | null
    );
  }, [notes]);

  const handleLogout = () => {
    Alert.alert("Esci dall'account", "Sei sicuro di voler uscire dall'account?", [
      {
        text: 'Annulla',
        style: 'cancel',
      },
      {
        text: 'Esci',
        style: 'destructive',
        onPress: () => {
          void logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      <Pressable
        className="h-[31.5px] flex-row items-center pb-4 pl-6 active:opacity-60"
        onPress={() => router.back()}>
        <Icon as={ChevronLeft} className="size-5 text-foreground" />
        <Text>Torna alla lista</Text>
      </Pressable>
      <ScrollView className="flex-1 px-4 pt-7">
        <View className="gap-4">
          <View className="mb-4 flex-row items-center">
            <Avatar className="mr-4 size-16" alt="Avatar">
              <AvatarFallback>
                <Text className="text-2xl font-semibold text-foreground">
                  {profileUser?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex-1">
              <Text className="text-foreground mb-1 text-2xl font-bold">Il tuo profilo</Text>
              <Text className="text-sm text-foreground/60">
                Gestisci il tuo account e le preferenze
              </Text>
            </View>
          </View>

          <Card>
            <CardHeader className="pb-3">
              <Text className="text-foreground mb-1 text-lg font-semibold">
                Informazioni personali
              </Text>
              <Text className="text-sm text-foreground/60">
                I tuoi dettagli e le preferenze
              </Text>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="mb-4">
                <Text className="text-foreground/60 mb-1 text-sm">Email</Text>
                <Text className="text-base text-foreground">
                  {profileUser?.email || 'Email non disponibile'}
                </Text>
              </View>
              <View>
                <Text className="text-foreground/60 mb-1 text-sm">Membro dal</Text>
                <Text className="text-base text-foreground">
                  {memberSince
                    ? format(new Date(memberSince), "dd MMMM yyyy 'alle ore' HH:mm", {
                        locale: it,
                      })
                    : 'Data non disponibile'}
                </Text>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-5">
              <Text className="text-foreground mb-1 text-lg font-semibold">Statistiche note</Text>
              <Text className="text-sm text-foreground/60">Riepilogo della tua attività</Text>
            </CardHeader>
            <CardContent>
              <View className="mb-5">
                <Text className="text-foreground/60 mb-1 text-sm">Note totali</Text>
                <Text className="text-foreground text-3xl font-bold">{notes.length}</Text>
              </View>

              <View className="bg-foreground/10 mb-5 h-px" />

              <View className="mb-5">
                <Text className="text-foreground/60 mb-1 text-sm">Tag totali</Text>
                <Text className="text-foreground text-3xl font-bold">{tags.length}</Text>
              </View>

              <View className="bg-foreground/10 mb-5 h-px" />

              <View>
                <Text className="text-foreground/60 mb-1 text-sm">Ultima modifica</Text>
                <Text className="text-base text-foreground">
                  {lastModifiedNote?.updated_at || lastModifiedNote?.created_at
                    ? format(
                        new Date(lastModifiedNote.updated_at || lastModifiedNote.created_at!),
                        "dd MMMM yyyy 'alle ore' HH:mm",
                        { locale: it }
                      )
                    : 'Nessuna nota disponibile'}
                </Text>
              </View>
            </CardContent>
          </Card>

          <Button
            variant="secondary"
            className="w-full flex-row gap-3"
            size="lg"
            onPress={handleLogout}>
            <Icon as={LogOut} className="size-5 text-foreground" />
            <Text>Esci dall&apos;account</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
