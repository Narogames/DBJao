import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para obter as informações do perfil do usuário
export const getUserProfile = async () => {
  try {
    // Obtém o ID do usuário armazenado no AsyncStorage
    const storedUserId = await AsyncStorage.getItem('userId');

    if (!storedUserId) {
      throw new Error('ID do usuário não encontrado');
    }

    // Realiza a requisição GET para obter os dados do perfil
    const response = await fetch(`http://localhost:8000/user/${storedUserId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar os dados do usuário');
    }

    // Converte a resposta em JSON e retorna os dados
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter os dados do perfil:', error);
    throw error; // Lança o erro para ser tratado no componente
  }
};
