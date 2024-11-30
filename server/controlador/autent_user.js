// authController.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para armazenar o ID do usuário
export const storeUserId = async (userId) => {
  try {
    await AsyncStorage.setItem('userId', userId);
  } catch (error) {
    console.error('Erro ao salvar o ID do usuário:', error);
  }
};

// Função para obter o ID do usuário
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId; // Retorna o ID do usuário, ou null se não existir
  } catch (error) {
    console.error('Erro ao obter o ID do usuário:', error);
    return null;
  }
};

// Função para limpar o ID do usuário (por exemplo, no logout)
export const removeUserId = async () => {
  try {
    await AsyncStorage.removeItem('userId');
  } catch (error) {
    console.error('Erro ao remover o ID do usuário:', error);
  }
};
