import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      // Recuperando o userId armazenado no AsyncStorage
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);

      if (!storedUserId) {
        console.log('ID do usuário não encontrado, redirecionando para login...');
        return;
      }

      // Fazendo uma requisição ao backend para pegar os dados do usuário
      try {
        const response = await fetch(`http://localhost:8000/user/${storedUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar os dados do usuário');
        }

        const data = await response.json();
        setName(data.nome);
        setEmail(data.email);
        setPassword(data.password);
        setIsActive(data.status);
        setProfilePicture(data.profile_image); // Ajustado para o campo correto
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
    } else {
      console.log("Seleção de imagem cancelada ou erro na seleção.");
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Selecione uma imagem para o perfil');
      return;
    }

    const formData = new FormData();
    formData.append('url', image); // Enviando o campo correto

    try {
      const response = await fetch(`http://localhost:8000/users/trocar-img/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: image }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Foto de perfil atualizada!', [{ text: 'OK' }]);
      } else {
        Alert.alert('Erro', data.message, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Erro ao enviar a imagem', error);
      Alert.alert('Erro', 'Erro ao enviar a imagem.', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <Text style={styles.noProfilePicture}>Sem foto de perfil</Text>
      )}

      <TouchableOpacity style={styles.changePictureButton} onPress={pickImage}>
        <Text style={styles.changePictureButtonText}>Alterar Foto</Text>
      </TouchableOpacity>

      {image && (
        <View>
          <Image source={{ uri: image }} style={styles.previewImage} />
        </View>
      )}

      <TouchableOpacity style={styles.changePictureButton} onPress={uploadImage}>
        <Text style={styles.changePictureButtonText}>Salvar Foto de Perfil</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nome: {name}</Text>
      <Text style={styles.label}>Email: {email}</Text>
      <Text style={styles.label}>Senha: {password}</Text>
      <Text style={styles.label}>Status: {isActive ? 'Ativo' : 'Inativo'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  noProfilePicture: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  changePictureButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  changePictureButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});

export default ProfileScreen;
