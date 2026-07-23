import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function NoteScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const [chargement, setChargement] = useState(true);
  const [note, setNote] = useState<number | null>(null);

  useEffect(() => {
    const recupererNote = async () => {
      if (!videoId) return;

      const { data, error } = await supabase
        .from('videos')
        .select('note')
        .eq('id', videoId)
        .single();

      if (!error && data) {
        setNote(data.note);

        await supabase
          .from('videos')
          .update({ statut: 'vue' })
          .eq('id', videoId);
      }

      setChargement(false);
    };

    recupererNote();
  }, [videoId]);

  const handleRetour = () => {
    router.replace('/');
  };

  if (chargement) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.chargementContainer}>
          <ActivityIndicator color="#c6a15b" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titre}>Ta note</Text>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.note}>{note ?? '—'}</Text>
        </View>

        <View style={styles.bas}>
          <Pressable style={styles.bouton} disabled>
            <Text style={styles.boutonTexte}>Partager en story</Text>
          </Pressable>

          <Pressable style={styles.retour} onPress={handleRetour}>
            <Text style={styles.retourTexte}>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0b0f1e',
  },
  chargementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c6a15b',
    textAlign: 'center',
  },
  noteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#c6a15b',
  },
  bas: {
    width: '100%',
  },
  bouton: {
    backgroundColor: '#c6a15b',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.5,
  },
  boutonTexte: {
    color: '#0b0f1e',
    fontSize: 16,
    fontWeight: '600',
  },
  retour: {
    alignItems: 'center',
    padding: 8,
  },
  retourTexte: {
    color: '#c6a15b',
    fontSize: 14,
  },
});