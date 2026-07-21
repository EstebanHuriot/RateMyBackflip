import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

// Statut simulé pour l'instant — sera remplacé par la vraie donnée Firebase plus tard
const aVideoEnAttente = false;

export default function AccueilScreen() {
  const router = useRouter();

  const handleFilmer = () => {
    // TODO: ouvrir la caméra (prochaine étape)
    Alert.alert('Filmer', 'Écran caméra à venir');
  };

  const handleImporter = () => {
    router.push('/consignes');
  };

  if (aVideoEnAttente) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titre}>RateMyBackflip</Text>
        </View>
        <View style={styles.statutContainer}>
          <Text style={styles.statut}>
            Ta vidéo est en cours de notation.{'\n'}Reviens un peu plus tard !
          </Text>
        </View>
        <View style={styles.espaceVide} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>RateMyBackflip</Text>
        <Text style={styles.sousTitre}>Montre-nous ton salto arrière</Text>
      </View>

      <Image
        source={require('../../assets/backflip-illustration.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <View style={styles.boutonsContainer}>
        <Pressable style={styles.bouton} onPress={handleFilmer}>
          <Text style={styles.boutonTexte}>Filmer</Text>
        </Pressable>

        <Pressable style={[styles.bouton, styles.boutonSecondaire]} onPress={handleImporter}>
          <Text style={styles.boutonTexteSecondaire}>Importer depuis la galerie</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#c6a15b',
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  statutContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statut: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  espaceVide: {
    height: 1,
  },
  illustration: {
    width: 330,
    height: 330,
    alignSelf: 'center',
  },
  boutonsContainer: {
    width: '100%',
  },
  bouton: {
    backgroundColor: '#c6a15b',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
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
