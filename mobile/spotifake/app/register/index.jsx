import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = () => {
  const [nome, setnome] = useState('');
  const [sobrenome, setsobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [senha, setsenha] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [datanascimento, setdatanascimento] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleCreate = async () => {
    if (!email || !senha || !nome || !sobrenome || !datanascimento) {
        Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
        return;
    }

    if (email !== confirmEmail) {
        Alert.alert('Erro', 'Os emails não coincidem');
        return;
    }

    if (senha !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/autenticacao/registro', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                senha: senha,
                nome: nome,
                sobrenome: sobrenome,
                dataNascimento: datanascimento,
            }),
        });

        if (response.status === 200) {
            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
        } else if (response.status === 409) {
            Alert.alert('Erro', 'O email já está registrado.');
        } else {
            Alert.alert('Erro', 'Ocorreu um erro durante o registro. Tente novamente.');
        }
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível se conectar ao servidor. Verifique sua conexão.');
        console.error(error);
    }
};


  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme === 'dark') {
          setIsDarkMode(true);
        }
      } catch (error) {
        console.log('Erro ao carregar o tema:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode ? 'dark' : 'light';
      await AsyncStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    } catch (error) {
      console.log('Erro ao salvar o tema:', error);
    }
  };

  const handleBirthDateChange = (text) => {
    let formattedDate = text.replace(/\D/g, '');
    if (formattedDate.length >= 2) {
      formattedDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2)}`;
    }
    if (formattedDate.length >= 5) {
      formattedDate = `${formattedDate.slice(0, 5)}/${formattedDate.slice(5)}`;
    }
    setdatanascimento(formattedDate);
  };


  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Criar conta</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>Falta pouco para criar sua conta!</Text>

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Nome"
        value={nome}
        onChangeText={setnome}
        placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
      />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Sobrenome"
        value={sobrenome}
        onChangeText={setsobrenome}
        placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
      />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
      />

      <TextInput
        style={[
          styles.input,
          email !== confirmEmail && confirmEmail.length > 0 && styles.inputError,
          isDarkMode && styles.darkInput,
        ]}
        placeholder="Confirmar Email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
      />

      <View style={[styles.passwordContainer, isDarkMode && styles.darkInput]}>
        <TextInput
          style={[
            styles.inputPassword,
            senha !== confirmPassword && confirmPassword.length > 0 && styles.inputError,
            isDarkMode && styles.darkInput,
          ]}
          placeholder="Senha"
          value={senha}
          onChangeText={setsenha}
          secureTextEntry={!showPassword}
          placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
        />
      </View>

      <View style={[styles.passwordContainer, isDarkMode && styles.darkInput]}>
        <TextInput
          style={[
            styles.inputPassword,
            senha !== confirmPassword && confirmPassword.length > 0 && styles.inputError,
            isDarkMode && styles.darkInput,
          ]}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
        />
      </View>

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Data de Nascimento (DD/MM/AAAA)"
        value={datanascimento}
        onChangeText={handleBirthDateChange}
        placeholderTextColor={isDarkMode ? '#aaa' : '#aaa'}
        keyboardType="numeric"
        maxLength={10}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.themeSwitch} onPress={toggleTheme}>
        <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={isDarkMode ? '#FFF' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DB954',
    textAlign: 'center',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  passwordContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  inputPassword: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeSwitch: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default SignUpScreen;
