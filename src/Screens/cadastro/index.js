import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function Cadastro() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imagem, setImagem] = useState(null);
  const [erros, setErros] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    peso: '',
    altura: ''
  });

  const validarFormulario = () => {
    const novosErros = {
      nome: nome.trim() ? '' : 'Nome é obrigatório',
      email: email.trim() ? '' : 'Email é obrigatório',
      senha: senha.length >= 6 ? '' : 'Senha deve ter no mínimo 6 caracteres',
      confirmarSenha: senha === confirmarSenha ? '' : 'Senhas não coincidem',
      peso: peso.trim() ? '' : 'Peso é obrigatório',
      altura: altura.trim() ? '' : 'Altura é obrigatória'
    };
    
    setErros(novosErros);
    return !Object.values(novosErros).some(erro => erro !== '');
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma foto');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const handleCadastro = async () => {
    if (!validarFormulario()) return;

    try {
      // Salvar dados localmente
      await AsyncStorage.multiSet([
        ['userNome', nome],
        ['userEmail', email],
        ['userPeso', peso],
        ['userAltura', altura],
        ['userImagem', imagem || '']
      ]);

      // Enviar para o backend (se tiver API)
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('password', senha);
      formData.append('peso', peso);
      formData.append('altura', altura);
      
      if (imagem) {
        formData.append('imagem', {
          uri: imagem,
          type: 'image/jpeg',
          name: 'profile.jpg'
        });
      }

      // Simulando envio para API (descomente quando tiver o backend)
      // const response = await axios.post('SUA_API_AQUI', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <LinearGradient
          colors={['#7209B7', '#5A00A3']}
          style={styles.circuloGradiente}
        >
          <Icon name="person-add" size={28} color="#fff" />
        </LinearGradient>
        <Text style={styles.titulo}>Crie sua conta</Text>
        <Text style={styles.subtitulo}>Preencha seus dados abaixo</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formulario}>
        {/* Campo Imagem */}
        <View style={styles.campoImagemContainer}>
          <Pressable onPress={selecionarImagem} style={styles.botaoImagem}>
            {imagem ? (
              <Image source={{ uri: imagem }} style={styles.imagemPerfil} />
            ) : (
              <View style={styles.placeholderImagem}>
                <Icon name="add-a-photo" size={30} color="#5A00A3" />
                <Text style={styles.textoBotaoImagem}>Adicionar foto</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Campo Nome */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Nome completo</Text>
          <View style={[styles.inputContainer, erros.nome ? styles.inputErro : null]}>
            <Icon name="person" size={20} color="#5A00A3" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
          </View>
          {erros.nome ? <Text style={styles.textoErro}>{erros.nome}</Text> : null}
        </View>

        {/* Campo Email */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>E-mail</Text>
          <View style={[styles.inputContainer, erros.email ? styles.inputErro : null]}>
            <Icon name="email" size={20} color="#5A00A3" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {erros.email ? <Text style={styles.textoErro}>{erros.email}</Text> : null}
        </View>

        {/* Campo Senha */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Senha</Text>
          <View style={[styles.inputContainer, erros.senha ? styles.inputErro : null]}>
            <Icon name="lock" size={20} color="#5A00A3" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>
          {erros.senha ? <Text style={styles.textoErro}>{erros.senha}</Text> : null}
        </View>

        {/* Campo Confirmar Senha */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Confirmar Senha</Text>
          <View style={[styles.inputContainer, erros.confirmarSenha ? styles.inputErro : null]}>
            <Icon name="lock" size={20} color="#5A00A3" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Digite novamente"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>
          {erros.confirmarSenha ? <Text style={styles.textoErro}>{erros.confirmarSenha}</Text> : null}
        </View>

        {/* Peso */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Seu peso (kg)</Text>
          <View style={[styles.inputContainer, erros.peso ? styles.inputErro : null]}>
            <Icon name="fitness-center" size={20} color="#5A00A3" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 70"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={peso}
              onChangeText={setPeso}
            />
          </View>
          {erros.peso ? <Text style={styles.textoErro}>{erros.peso}</Text> : null}
        </View>

        {/* Altura */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Sua altura (cm)</Text>
          <View style={[styles.inputContainer, erros.altura ? styles.inputErro : null]}>
            <Icon name="straighten" size={20} color="#5A00A3" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 175"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={altura}
              onChangeText={setAltura}
            />
          </View>
          {erros.altura ? <Text style={styles.textoErro}>{erros.altura}</Text> : null}
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity 
          style={styles.botao}
          activeOpacity={0.8}
          onPress={handleCadastro}
        >
          <LinearGradient
            colors={['#7209B7', '#5A00A3']}
            style={styles.botaoGradiente}
          >
            <Text style={styles.textoBotao}>Cadastrar</Text>
            <Icon name="arrow-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Link para Login */}
      <TouchableOpacity 
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.textoLink}>Já tem conta? <Text style={styles.textoDestaque}>Faça login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 25,
  },
  circuloGradiente: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
  },
  formulario: {
    marginTop: 10,
  },
  campoImagemContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoImagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },
  placeholderImagem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoImagem: {
    color: '#5A00A3',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  campo: {
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 14,
    color: '#3A0CA3',
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#3A0CA3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputErro: {
    borderColor: '#FF4D6D',
  },
  icone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 15,
  },
  textoErro: {
    color: '#FF4D6D',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
  botao: {
    borderRadius: 12,
    height: 50,
    marginTop: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#3A0CA3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  botaoGradiente: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  link: {
    marginTop: 25,
    alignItems: 'center',
  },
  textoLink: {
    color: '#666',
    fontSize: 14,
  },
  textoDestaque: {
    color: '#5A00A3',
    fontWeight: 'bold',
  },
});