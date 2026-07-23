import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ensureUser, supabase } from '../lib/supabase';

export default function AccueilScreen() {
  const router = useRouter();
  const [chargement, setChargement] = useState(true);
  const [aVideoEnAttente, setAVideoEnAttente] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let annule = false;

      const verifierStatut = async () => {
        setChargement(true);
        try {
          const user = await ensureUser();
          const { data, error } = await supabase
            .from('videos')
            .select('id')
            .eq('user_id', user.id)
            .eq('statut', 'en_attente')
            .limit(1);

          if (!annule) {
            if (error) {
              console.log('Erreur vérification statut :', error.message);
              setAVideoEnAttente(false);
            } else {
              setAVideoEnAttente((data?.length ?? 0) > 0);
            }
          }
        } catch (erreur: any) {
          console.log('Erreur ensureUser :', erreur.message);
        } finally {
          if (!annule) {
            setChargement(false);
          }
        }
      };

      verifierStatut();

      return () => {
        annule = true;
      };
    }, [])
  );

  const handleFilmer = () => {
    router.push({ pathname: '/consignes', params: { mode: 'filmer' } });
  };

  const handleImporter = () => {
    router.push({ pathname: '/consignes', params: { mode: 'importer' } });
  };

  if (chargement) {
    return (
      <View style={styles.container}>
        <View style={styles.statutContainer}>
          <ActivityIndicator color="#c6a15b" size="large" />
        </View>
      </View>
    );
  }

  if (aVideoEnAttente) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titre}>RateMyBackflip</Text>
        </View>

        <View style={styles.milieuAttente}>
          <Image
            source={require('../../assets/backflip-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.statut}>
            Ta vidéo est en cours de notation.{'\n'}Reviens un peu plus tard !
          </Text>
        </View>
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
    alignItems: 'center',
  },
  milieuAttente: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  statut: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 128,
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