import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';




export default function Cadastro() {

  const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [confirmarSenha, setConfirmarSenha] = useState('');
const [peso, setPeso] = useState('');
const [altura, setAltura] = useState('');


const handleCadastro = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/registrar', {
      nome: nome,
      email: email,
      password: senha,
      peso: peso,
      altura: altura
    });

    console.log('Usuário cadastrado:', response.data);
    alert('Cadastro realizado com sucesso!');


  } catch (error) {
    if (error.response) {
      console.log('Erros de validação:', error.response.data.errors);
      alert('Erro no cadastro. Verifique os dados e tente novamente.');
    } else {
      console.error('Erro:', error.message);
    }
  }
};
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <View style={styles.circuloRoxo}>
          <Icon name="person-add" size={28} color="#fff" />
        </View>
        <Text style={styles.titulo}>Crie sua conta</Text>
        <Text style={styles.subtitulo}>Preencha seus dados abaixo</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formulario}>
        {/* Campo Nome */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Nome completo</Text>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#6200ee" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
          </View>
        </View>

        {/* Campo Email */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>E-mail</Text>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#6200ee" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Campo Senha */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Senha</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#6200ee" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>
        </View>

       
      

 {/* Peso */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Seu peso</Text>
          <View style={styles.inputContainer}>
            <Icon name="fitness-center" size={20} color="#6200ee" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Digite novamente"
              placeholderTextColor="#999"
             
              value={peso}
              onChangeText={setPeso}

            />
          </View>
        </View>

         {/* Altura */}
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Sua altura</Text>
          <View style={styles.inputContainer}>
            <Icon name="man-4" size={20} color="#6200ee" style={styles.icone} />
            <TextInput
              style={styles.input}
              placeholder="Digite novamente"
              placeholderTextColor="#999"
           
              value={altura}
              onChangeText={setAltura}

            />
          </View>
        </View>


        {/* Botão Cadastrar */}
        <TouchableOpacity 
          style={styles.botao}
          activeOpacity={0.8}
          onPress={handleCadastro}
        >
          <Text style={styles.textoBotao}>Cadastrar</Text>
          <Icon name="arrow-forward" size={24} color="#fff" />
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
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 25,
    paddingBottom: 40
  },
  cabecalho: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 30
  },
  circuloRoxo: {
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 5
  },
  subtitulo: {
    fontSize: 14,
    color: '#666'
  },
  formulario: {
    marginTop: 10
  },
  campo: {
    marginBottom: 20
  },
  rotulo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: '500'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2
  },
  icone: {
    marginRight: 10,
    opacity: 0.7
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 15
  },
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 12,
    height: 50,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10
  },
  link: {
    marginTop: 25,
    alignItems: 'center'
  },
  textoLink: {
    color: '#666',
    fontSize: 14
  },
  textoDestaque: {
    color: '#6200ee',
    fontWeight: 'bold'
  }
});