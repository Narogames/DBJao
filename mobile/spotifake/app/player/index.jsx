import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Slider, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Player() {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Dados de exemplo, substitua com dados reais vindos da API ou outro estado
  const playingNow = {
    titulo: "Exemplo de Música",
    artistum: { nome: "Artista Exemplo" },
    album: { coverImageUrl: "https://via.placeholder.com/250", title: "Álbum Exemplo" },
    duracao: 180, // duração em segundos (exemplo de 3 minutos)
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // URL do áudio de exemplo
  };

  useEffect(() => {
    const loadAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: playingNow.audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    };

    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync(); // Limpeza do áudio ao sair da tela
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000); // Convertendo milissegundos para segundos
      setDuration(status.durationMillis / 1000); // Convertendo milissegundos para segundos
    }
  };

  const playPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF8746" />
      ) : (
        <>
          <Image source={{ uri: playingNow.album.coverImageUrl }} style={styles.coverImage} />
          <Text style={styles.songTitle}>{playingNow.titulo}</Text>
          <Text style={styles.artistName}>{playingNow.artistum.nome}</Text>
          <Text style={styles.albumTitle}>{playingNow.album.title}</Text>

          <View style={styles.controls}>
            <View style={styles.card3}>
              <Text style={styles.timeText}>
                {formatTime(position)} / {formatTime(duration)}
              </Text>
              <Ionicons
                name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                size={32}
                color="#FF8746"
                style={styles.iconPlayer}
                onPress={playPause}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coverImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 18,
    color: '#777',
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playPauseButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8746',
  },
  card3: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconPlayer: {
    marginLeft: 20,
  },
});
