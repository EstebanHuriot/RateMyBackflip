import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ensureUser, supabase } from '../lib/supabase';

type EtatAccueil = 'normal' | 'en_attente' | 'notee';

export default function AccueilScreen() {
  const router = useRouter();
  const [chargement, setChargement] = useState(true);
  const [etat, setEtat] = useState<EtatAccueil>('normal');
  const [videoId, setVideoId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let annule = false;

      const verifierStatut = async () => {
        setChargement(true);
        try {
          const user = await ensureUser();
          const { data, error } = await supabase
            .from('videos')
            .select('id, statut')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!annule) {
            if (error || !data || data.length === 0) {
              setEtat('normal');
              setVideoId(null);
            } else {
              const derniere = data[0];
              if (derniere.statut === 'en_attente') {
                setEtat('en_attente');
              } else if (derniere.statut === 'notee') {
                setEtat('notee');
                setVideoId(derniere.id);
              } else {
                setEtat('normal');
              }
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

  const naviguerVersConsignes = async (mode: 'filmer' | 'importer') => {
    const consentement = await AsyncStorage.getItem('consentement_confidentialite');
    if (consentement === 'true') {
      router.push({ pathname: '/consignes', params: { mode } });
    } else {
      router.push({ pathname: '/consentement', params: { mode } });
    }
  };

  const handleFilmer = () => naviguerVersConsignes('filmer');
  const handleImporter = () => naviguerVersConsignes('importer');

  const handleVoirNote = () => {
    if (videoId) {
      router.push({ pathname: '/note', params: { videoId } });
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>RateMyBackflip</Text>
        <Text style={[styles.sousTitre, etat !== 'normal' && styles.sousTitreCache]}>
          Montre-nous ton salto arrière
        </Text>
      </View>

      <Image
        source={require('../../assets/backflip-illustration.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <View style={styles.bas}>
        {etat === 'normal' && (
          <View style={styles.boutonsContainer}>
            <Pressable style={styles.bouton} onPress={handleFilmer}>
              <Text style={styles.boutonTexte}>Filmer</Text>
            </Pressable>
            <Pressable style={[styles.bouton, styles.boutonSecondaire]} onPress={handleImporter}>
              <Text style={styles.boutonTexteSecondaire}>Importer depuis la galerie</Text>
            </Pressable>
          </View>
        )}

        {etat === 'en_attente' && (
          <Text style={styles.statut}>
            Ta vidéo est en cours de notation.{'\n'}Reviens un peu plus tard !
          </Text>
        )}

        {etat === 'notee' && (
          <View style={styles.boutonsContainer}>
            <Pressable style={styles.bouton} onPress={handleVoirNote}>
              <Text style={styles.boutonTexte}>Voir ma note !</Text>
            </Pressable>
          </View>
        )}
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
  sousTitreCache: {
    opacity: 0,
  },
  statutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 330,
    height: 330,
    alignSelf: 'center',
    marginTop: 20,
  },
  bas: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  statut: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
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