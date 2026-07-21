import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DUREE_MAX_SECONDES = 5;

export default function ConsignesScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const modeFilmer = mode === 'filmer';
  const { height } = useWindowDimensions();

  // Taille de la vidéo calculée à partir de la hauteur réelle de l'écran,
  // pour que tout (titre + vidéo + règles + boutons) tienne toujours sans scroll.
  const videoHeight = height * 0.5;
  const videoWidth = videoHeight * 0.8; // ratio proche du format source (720x900)

  const player = useVideoPlayer(
    require('../../assets/exemple-salto.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  );

  const traiterVideo = async (video: { uri: string; duration?: number | null; width?: number; height?: number }) => {
    const dureeSecondes = (video.duration ?? 0) / 1000;
    const estPortrait = (video.height ?? 0) > (video.width ?? 0);

    if (dureeSecondes > DUREE_MAX_SECONDES) {
      Alert.alert(
        'Vidéo trop longue',
        `Ta vidéo dure ${dureeSecondes.toFixed(1)} secondes. Elle doit durer ${DUREE_MAX_SECONDES} secondes maximum.`
      );
      return;
    }

    if (!estPortrait) {
      Alert.alert(
        'Mauvaise orientation',
        'Ta vidéo est en format paysage. Elle doit être filmée en format portrait (vertical).'
      );
      return;
    }

    try {
      const destination = FileSystem.cacheDirectory + 'salto-en-attente.mp4';
      await FileSystem.copyAsync({ from: video.uri, to: destination });
      router.push({ pathname: '/confirmation', params: { filename: 'salto-en-attente.mp4' } });
    } catch (erreur: any) {
      Alert.alert('Erreur', "Impossible de préparer la vidéo : " + erreur.message);
    }
  };

  const handleFilmer = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission refusée',
        "L'application a besoin d'accéder à ta caméra pour filmer."
      );
      return;
    }

    const resultat = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      videoMaxDuration: DUREE_MAX_SECONDES,
      allowsEditing: false,
    });

    if (resultat.canceled) {
      return;
    }

    await traiterVideo(resultat.assets[0]);
  };

  const handleImporter = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission refusée',
        "L'application a besoin d'accéder à ta galerie pour choisir une vidéo."
      );
      return;
    }

    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (resultat.canceled) {
      return;
    }

    await traiterVideo(resultat.assets[0]);
  };

  const handleContinuer = () => {
    if (modeFilmer) {
      handleFilmer();
    } else {
      handleImporter();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titre}>Avant d'envoyer</Text>
        </View>

        <View style={styles.milieu}>
          <VideoView
            style={[styles.video, { width: videoWidth, height: videoHeight }]}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />
          <Text style={styles.labelExemple}>exemple</Text>

          <View style={styles.regles}>
            <Text style={styles.regle}>📱 Vidéo en format portrait (vertical)</Text>
            <Text style={styles.regle}>👤 Filme-toi de profil</Text>
            <Text style={styles.regle}>⏱️ 5 secondes maximum</Text>
            <Text style={styles.regle}>🧱 Sur un sol plat</Text>
          </View>
        </View>

        <View style={styles.bas}>
          <Pressable style={styles.bouton} onPress={handleContinuer}>
            <Text style={styles.boutonTexte}>
              {modeFilmer ? 'Filmer' : 'Choisir la vidéo'}
            </Text>
          </Pressable>

          <Pressable style={styles.retour} onPress={() => router.back()}>
            <Text style={styles.retourTexte}>Retour</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c6a15b',
    textAlign: 'center',
  },
  milieu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    borderRadius: 12,
    backgroundColor: '#000000',
    marginBottom: 4,
  },
  labelExemple: {
    color: '#c6a15b',
    fontSize: 11,
    fontStyle: 'italic',
    opacity: 0.55,
    marginBottom: 10,
  },
  regles: {
    alignItems: 'center',
  },
  regle: {
    color: '#ffffff',
    fontSize: 13,
    marginBottom: 6,
    textAlign: 'center',
  },
  bas: {
    width: '100%',
  },
  bouton: {
    backgroundColor: '#c6a15b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  boutonTexte: {
    color: '#0b0f1e',
    fontSize: 16,
    fontWeight: '600',
  },
  retour: {
    alignItems: 'center',
    padding: 6,
  },
  retourTexte: {
    color: '#c6a15b',
    fontSize: 14,
  },
});