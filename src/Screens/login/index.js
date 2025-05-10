import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                password: senha,
            });
            

     
        
            const { token, user } = response.data;
    
          
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
    
            console.log('Login realizado com sucesso');
            navigation.navigate('Home');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Credenciais inválidas. Verifique seu e-mail e senha.');
            } else {
                console.error('Erro no login:', error);
                alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <View 
            style={estilos.container}
        >
            <ScrollView contentContainerStyle={estilos.scrollContainer}>
                {/* Header */}
                <View style={estilos.header}>
                    <Icon name="fitness-center" size={50} color="#5A00A3" />
                    <Text style={estilos.titulo}>Bem-vindo de volta!</Text>
                    <Text style={estilos.subtitulo}>Acesse sua conta para continuar</Text>
                </View>

                {/* Formulário */}
                <View style={estilos.formContainer}>
                    <View style={estilos.inputContainer}>
                        <Icon name="email" size={20} color="#5A00A3" style={estilos.iconeInput} />
                        <TextInput
                            style={estilos.input}
                            placeholder="E-mail"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={estilos.inputContainer}>
                        <Icon name="lock" size={20} color="#5A00A3" style={estilos.iconeInput} />
                        <TextInput
                            style={estilos.input}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={senha}
                            onChangeText={setSenha}
                        />
                    </View>

                    <TouchableOpacity style={estilos.botao} onPress={handleLogin}>
                        <Text style={estilos.textoBotao}>Entrar</Text>
                        <Icon name="arrow-forward" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={estilos.link}
                        onPress={() => navigation.navigate('Cadastro')}
                    >
                        <Text style={estilos.textoLink}>Não tem conta? <Text style={estilos.textoDestaque}>Cadastre-se</Text></Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30
    },
    header: {
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 30
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5A00A3',
        marginTop: 15
    },
    subtitulo: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    formContainer: {
        paddingHorizontal: 30,
        marginTop: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#6200ee',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    iconeInput: {
        marginRight: 10
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16
    },
    botao: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5A00A3',
        borderRadius: 25,
        height: 50,
        marginTop: 20,
        elevation: 3
    },
    textoBotao: {
        color: '#fff',
        fontSize: 18,
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
        color: '#5A00A3',
        fontWeight: 'bold'
    }
});