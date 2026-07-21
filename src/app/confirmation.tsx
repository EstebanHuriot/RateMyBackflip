import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { filename } = useLocalSearchParams<{ filename: string }>();
  const uri = filename ? FileSystem.cacheDirectory + filename : null;

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

  const handleEnvoyer = () => {
    // TODO: upload vers Firebase (prochaine étape)
    player.pause();
    router.replace('/');
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
        <Pressable style={styles.bouton} onPress={handleEnvoyer}>
          <Text style={styles.boutonTexte}>Envoyer</Text>
        </Pressable>

        <Pressable style={[styles.bouton, styles.boutonSecondaire]} onPress={handleRefaire}>
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