import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [dataArtists, setDataArtists] = useState([]);
  const [dataAlbums, setDataAlbums] = useState([]);
  const [dataSongs, setDataSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNavigateToProfile = () => {
    router.push('/perfil');
  };

  const getDataArtistas = async () => {
    try {
      const response = await fetch('http://localhost:8000/artista');
      if (response.status === 200) {
        const data = await response.json();
        setDataArtists(data);
      } else {
        Alert.alert('Erro', 'Problema ao obter artistas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar dados');
    }
  };

  const getDataAlbums = async () => {
    try {
      const response = await fetch('http://localhost:8000/album');
      if (response.status === 200) {
        const data = await response.json();
        setDataAlbums(data);
      } else {
        Alert.alert('Erro', 'Problema ao obter álbuns');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar dados');
    }
  };

  const getDataSongs = async (albumId) => {
    try {
      const response = await fetch(`http://localhost:8000/album/${albumId}/musicas/`);
      if (response.status === 200) {
        const data = await response.json();
        setDataSongs((prevSongs) => [...prevSongs, ...data]); 
      } else {
        Alert.alert('Erro', 'Problema ao obter músicas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar músicas');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await getDataArtistas();
      await getDataAlbums();
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (dataAlbums.length > 0) {
      dataAlbums.forEach((album) => {
        getDataSongs(album.id);
      });
    }
  }, [dataAlbums]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredArtists = searchText
    ? dataArtists.filter((artist) => artist.nome.toLowerCase().includes(searchText.toLowerCase()))
    : dataArtists;

  const renderArtistItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.nome}</Text>
    </View>
  );

  const renderAlbumItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.title}</Text>
    </View>
  );

  const renderSongItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.nome}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha uma opção:</Text>

      <TouchableOpacity style={styles.button} onPress={handleNavigateToProfile}>
        <Text style={styles.buttonText}>Ir para o Perfil</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Pesquisar artistas"
      />

      <Text style={styles.sectionTitle}>Artistas</Text>
      <FlatList
        data={filteredArtists}
        renderItem={renderArtistItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Álbuns</Text>
      <FlatList
        data={dataAlbums}
        renderItem={renderAlbumItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Músicas</Text>
      <FlatList
        data={dataSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  card: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 15,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
