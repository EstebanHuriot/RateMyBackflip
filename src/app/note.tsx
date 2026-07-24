import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { supabase } from '../lib/supabase';

export default function NoteScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { width } = useWindowDimensions();
  const [chargement, setChargement] = useState(true);
  const [note, setNote] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState<string | null>(null);
  const [partageEnCours, setPartageEnCours] = useState(false);
  const viewShotRef = useRef<React.ElementRef<typeof ViewShot>>(null);

  const carteWidth = width * 0.72;
  const carteHeight = carteWidth * (16 / 9);

  useEffect(() => {
    const recupererDonnees = async () => {
      if (!videoId) return;

      const { data, error } = await supabase
        .from('videos')
        .select('note, commentaire')
        .eq('id', videoId)
        .single();

      if (!error && data) {
        setNote(data.note);
        setCommentaire(data.commentaire);

        await supabase
          .from('videos')
          .update({ statut: 'vue' })
          .eq('id', videoId);
      }

      setChargement(false);
    };

    recupererDonnees();
  }, [videoId]);

  const handleRetour = () => {
    router.replace('/');
  };

  const handlePartager = async () => {
    if (!viewShotRef.current?.capture) return;

    setPartageEnCours(true);
    try {
      const disponible = await Sharing.isAvailableAsync();
      if (!disponible) {
        alert("Le partage n'est pas disponible sur cet appareil.");
        return;
      }

      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Partager ma note RateMyBackflip',
      });
    } catch (erreur) {
      console.log('Erreur partage :', erreur);
    } finally {
      setPartageEnCours(false);
    }
  };

  const noteAffichee = note !== null ? note.toFixed(1).replace('.0', '') : '—';

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

        <View style={styles.carteWrapper}>
          <ImageBackground
            source={require('../../assets/checker-pattern.png')}
            resizeMode="repeat"
            style={[styles.damier, { width: carteWidth, height: carteHeight }]}
            imageStyle={styles.damierImage}
          >
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1 }}
            >
              <View style={[styles.carte, { width: carteWidth, height: carteHeight }]}>
                <View style={styles.rangeeHaut}>
                  <View style={styles.badgeCommentaireContainer}>
                    {commentaire ? (
                      <Text style={styles.commentaireTexte}>{commentaire}</Text>
                    ) : null}
                  </View>

                  <View style={styles.badgeNote}>
                    <Text style={styles.badgeEyebrow}>Ta note</Text>
                    <View style={styles.badgeScoreLigne}>
                      <Text style={styles.badgeScore}>{noteAffichee}</Text>
                      <Text style={styles.badgeBareme}>/10</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.zoneBasse}>
                  <Image
                    source={require('../../assets/backflip-illustration.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                  <Text style={styles.cta}>
                    Toi aussi, fais noter ton salto arrière.{'\n'}
                    <Text style={styles.ctaGras}>Télécharge RateMyBackflip.</Text>
                  </Text>
                </View>
              </View>
            </ViewShot>
          </ImageBackground>

          <Text style={styles.indiceTransparence}>
            Le damier ne sera pas visible dans l'image partagée.{'\n'}Ajoute ça sur la vidéo de ton salto !
          </Text>
        </View>

        <View style={styles.bas}>
          <Pressable
            style={[styles.bouton, partageEnCours && styles.boutonDesactive]}
            onPress={handlePartager}
            disabled={partageEnCours}
          >
            {partageEnCours ? (
              <ActivityIndicator color="#0b0f1e" />
            ) : (
              <Text style={styles.boutonTexte}>Partager en story</Text>
            )}
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
  carteWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  damier: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  damierImage: {
    borderRadius: 20,
  },
  carte: {
    position: 'relative',
  },
  indiceTransparence: {
    color: '#ffffff',
    opacity: 0.4,
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
  },
  rangeeHaut: {
    position: 'absolute',
    top: 6,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // Occupe tout l'espace restant entre le bord gauche et le badge de note,
  // et centre le texte à l'intérieur de cet espace.
  badgeCommentaireContainer: {
    flex: 1,
    paddingTop: 14,
    marginRight: 10,
    alignItems: 'center',
  },
  commentaireTexte: {
    color: '#e8c987',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  badgeNote: {
    backgroundColor: 'rgba(11,15,30,0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(198,161,91,0.6)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  badgeEyebrow: {
    color: '#c6a15b',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  badgeScoreLigne: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  badgeScore: {
    color: '#e8c987',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  badgeBareme: {
    color: '#f5f2ea',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
    marginLeft: 3,
    marginBottom: 4,
  },
  zoneBasse: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: 70,
    height: 70,
    marginBottom: 2,
  },
  cta: {
    color: '#f5f2ea',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  ctaGras: {
    color: '#e8c987',
    fontWeight: '700',
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
    opacity: 0.6,
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