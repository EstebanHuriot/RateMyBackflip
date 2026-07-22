import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ensureUser, supabase } from '../lib/supabase';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { filename } = useLocalSearchParams<{ filename: string }>();
  const uri = filename ? FileSystem.cacheDirectory + filename : null;
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (uri) {
      player.replaceAsync(uri).then(() => {
        player.play();
      });
    }
  }, [uri]);

  const handleEnvoyer = async () => {
    if (!uri) return;

    setEnvoiEnCours(true);
    try {
      const user = await ensureUser();

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Session utilisateur introuvable.");
      }

      const cheminFichier = `${user.id}/${Date.now()}.mp4`;
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
      const urlUpload = `${supabaseUrl}/storage/v1/object/videos-saltos/${cheminFichier}`;

      const resultatUpload = await FileSystem.uploadAsync(urlUpload, uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'video/mp4',
        },
      });

      if (resultatUpload.status !== 200) {
        throw new Error(`Échec de l'upload (code ${resultatUpload.status}) : ${resultatUpload.body}`);
      }

      const { error: erreurInsertion } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          statut: 'en_attente',
        });

      if (erreurInsertion) {
        throw erreurInsertion;
      }

      player.pause();
      router.replace('/');
    } catch (erreur: any) {
      Alert.alert('Erreur', "L'envoi a échoué : " + erreur.message);
      setEnvoiEnCours(false);
    }
  };

  const handleRefaire = () => {
    player.pause();
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Tu valides ?</Text>
      </View>

      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      <View style={styles.boutonsContainer}>
        <Pressable
          style={[styles.bouton, envoiEnCours && styles.boutonDesactive]}
          onPress={handleEnvoyer}
          disabled={envoiEnCours}
        >
          {envoiEnCours ? (
            <ActivityIndicator color="#0b0f1e" />
          ) : (
            <Text style={styles.boutonTexte}>Envoyer</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.bouton, styles.boutonSecondaire]}
          onPress={handleRefaire}
          disabled={envoiEnCours}
        >
          <Text style={styles.boutonTexteSecondaire}>Refaire</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1e',
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 50,
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
  video: {
    width: '75%',
    aspectRatio: 9 / 16,
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: '#000000',
  },
  boutonsContainer: {
    width: '100%',
  },
  bouton: {
    backgroundColor: '#c6a15b',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  boutonDesactive: {
    opacity: 0.6,
  },
  boutonSecondaire: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#c6a15b',
  },
  boutonTexte: {
    color: '#0b0f1e',
    fontSize: 16,
    fontWeight: '600',
  },
  boutonTexteSecondaire: {
    color: '#c6a15b',
    fontSize: 16,
    fontWeight: '600',
  },
});