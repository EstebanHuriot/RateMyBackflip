import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const URL_POLITIQUE = 'https://curious-taffy-90044b.netlify.app/';

export default function ConsentementScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [coche, setCoche] = useState(false);

  const handleAccepter = async () => {
    await AsyncStorage.setItem('consentement_confidentialite', 'true');
    router.replace({ pathname: '/consignes', params: { mode } });
  };

  const handleRefuser = () => {
    router.back();
  };

  const ouvrirPolitique = () => {
    Linking.openURL(URL_POLITIQUE);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titre}>Avant de continuer</Text>
        </View>

        <View style={styles.milieu}>
          <Text style={styles.texte}>
            En envoyant ta vidéo, tu acceptes qu'elle soit visionnée par notre
            équipe pour être notée, et conservée pour améliorer l'application
            — y compris pour entraîner un futur modèle d'intelligence
            artificielle.
          </Text>

          <Pressable onPress={ouvrirPolitique}>
            <Text style={styles.lien}>Lire la politique de confidentialité complète</Text>
          </Pressable>

          <Pressable
            style={styles.caseContainer}
            onPress={() => setCoche(!coche)}
          >
            <View style={[styles.case, coche && styles.caseCochee]}>
              {coche && <Text style={styles.caseCoche}>✓</Text>}
            </View>
            <Text style={styles.caseTexte}>
              J'ai lu et j'accepte la politique de confidentialité
            </Text>
          </Pressable>
        </View>

        <View style={styles.bas}>
          <Pressable
            style={[styles.bouton, !coche && styles.boutonDesactive]}
            onPress={handleAccepter}
            disabled={!coche}
          >
            <Text style={styles.boutonTexte}>Continuer</Text>
          </Pressable>

          <Pressable style={styles.retour} onPress={handleRefuser}>
            <Text style={styles.retourTexte}>Annuler</Text>
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
    paddingTop: 20,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c6a15b',
    textAlign: 'center',
  },
  milieu: {
    flex: 1,
    justifyContent: 'center',
  },
  texte: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  lien: {
    color: '#c6a15b',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginBottom: 30,
  },
  caseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  case: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#c6a15b',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseCochee: {
    backgroundColor: '#c6a15b',
  },
  caseCoche: {
    color: '#0b0f1e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  caseTexte: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
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
  },
  boutonDesactive: {
    opacity: 0.35,
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