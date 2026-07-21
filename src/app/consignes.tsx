import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const DUREE_MAX_SECONDES = 5;

export default function ConsignesScreen() {
  const router = useRouter();

  const handleContinuer = async () => {
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

    const video = resultat.assets[0];
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

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Avant d'envoyer</Text>

      <View style={styles.regles}>
        <Text style={styles.regle}>📱 Vidéo en format portrait (vertical)</Text>
        <Text style={styles.regle}>👤 Filme-toi de profil</Text>
        <Text style={styles.regle}>⏱️ 5 secondes maximum</Text>
        <Text style={styles.regle}>🧱 Sur un sol plat</Text>
      </View>

      <Pressable style={styles.bouton} onPress={handleContinuer}>
        <Text style={styles.boutonTexte}>Choisir la vidéo</Text>
      </Pressable>

      <Pressable style={styles.retour} onPress={() => router.back()}>
        <Text style={styles.retourTexte}>Retour</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1e',
    padding: 24,
    justifyContent: 'center',
  },
  titre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#c6a15b',
    textAlign: 'center',
    marginBottom: 40,
  },
  regles: {
    marginBottom: 50,
  },
  regle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
  },
  bouton: {
    backgroundColor: '#c6a15b',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  boutonTexte: {
    color: '#0b0f1e',
    fontSize: 16,
    fontWeight: '600',
  },
  retour: {
    alignItems: 'center',
    padding: 12,
  },
  retourTexte: {
    color: '#c6a15b',
    fontSize: 14,
  },
});