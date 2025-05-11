import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TextInput, 
  Pressable,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


export default function Perfil() {
    const navigation = useNavigation();

    const [userData, setUserData] = useState({
      nome: '',
      email: '',
      peso: '',
      altura: '',
      imagem_url: null
    });

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [imagemTemp, setImagemTemp] = useState(null);
  const [imagem, setImagem] = useState(null);
  const BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {

    const carregarPerfil = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const { data } = await axios.get(`${BASE_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });

       
        
        setUserData({
          nome: data.nome || '',
          email: data.email || '',
          peso: data.peso ? String(data.peso) : '',
          altura: data.altura ? String(data.altura) : '',
          imagem_url: data.imagem_url || null
        });

        console.log('userData atualizado:', userData);
        
      } catch (err) {
        console.log("Erro ao carregar:", err.message);
        navigation.navigate('Login'); 
      } finally {
        setLoading(false);
      }

      
    };
    carregarPerfil();
  }, []);


 




  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma foto');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

 

    if (!result.canceled && result.assets) {
      setImagem(result.assets[0]); // Atualiza o state com a imagem selecionada
    }

  };



  const salvarAlteracoes = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      
      // Use userData em vez de variáveis soltas
      formData.append('peso', userData.peso);
      formData.append('altura', userData.altura);
      
      if (imagem && imagem.uri.startsWith('data:image')) {
        const base64Response = await fetch(imagem.uri);
        const blob = await base64Response.blob();
        
        formData.append('imagem', blob, imagem.name || 'foto.png');
      }
  
  
      const { data } = await axios.post(`${BASE_URL}/api/atualizarPerfil`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
    
      setUserData(prev => ({
        ...prev,
        peso: data.peso,
        altura: data.altura,
        imagem_url: data.imagem_url || prev.imagem_url
      }));
      
      setImagemTemp(null);
      setEditando(false);
      Alert.alert('✅ Sucesso!', 'Perfil atualizado');
      
    } catch (error) {
      console.error('Erro:', error.response?.data || error.message);
      Alert.alert('❌ Erro', error.response?.data?.message || 'Falha ao atualizar');
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Área da Foto */}
      <View style={styles.fotoArea}>
  <Pressable 
    style={styles.fotoContainer}
    onPress={editando ? selecionarImagem : null}
  >
    {imagem ? (
      <Image 
        source={{ uri: imagem.uri }} 
        style={styles.fotoPerfil} 
      />
    ) : userData.imagem_url ? (
      <Image 
        source={{ uri: userData.imagem_url }} 
        style={styles.fotoPerfil} 
      />
    ) : (
      <View style={styles.fotoPlaceholder}>
        <Icon name="person" size={50} color="#5A00DD" />
      </View>
    )}
    {editando && (
      <View style={styles.badgeEditar}>
        <Icon name="edit" size={16} color="#FFF" />
      </View>
    )}
  </Pressable>
</View>
      {/* Dados do Usuário */}
      <View style={styles.dadosContainer}>
        <Text style={styles.nomeUsuario}>{userData.nome}</Text>
        <Text style={styles.emailUsuario}>{userData.email}</Text>

        <View style={styles.camposContainer}>
          <View style={styles.campo}>
            <Text style={styles.label}>Peso (kg)</Text>
            {editando ? (
              <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userData.peso}
              onChangeText={(t) => setUserData({...userData, peso: t})}
            />
            ) : (
              <Text style={styles.textoDado}>{userData.peso} kg</Text>
            )}
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Altura (cm)</Text>
            {editando ? (
             <TextInput
             style={styles.input}
             keyboardType="numeric"
             value={userData.altura}
             onChangeText={(t) => setUserData({...userData, altura: t})}
           />
            ) : (
              <Text style={styles.textoDado}>{userData.altura} cm</Text>
            )}
          </View>
        </View>
      </View>

      {/* Botões */}
      <View style={styles.botoesContainer}>
        {editando ? (
          <>
            <Pressable 
              style={[styles.botao, styles.botaoSalvar]}
              onPress={salvarAlteracoes}
            >
              <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </Pressable>
            <Pressable 
              style={[styles.botao, styles.botaoCancelar]}
              onPress={() => setEditando(false)}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </Pressable>
          </>
        ) : (
          <Pressable 
            style={[styles.botao, styles.botaoEditar]}
            onPress={() => setEditando(true)}
          >
            <Text style={styles.textoBotao}>Editar Perfil</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 30,
    paddingBottom: 40,
  },
  fotoArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    shadowColor: '#5A00DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  fotoPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 70,
  },
  badgeEditar: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#5A00DD',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  dadosContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nomeUsuario: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3A0CA3',
    textAlign: 'center',
    marginBottom: 5,
  },
  emailUsuario: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  camposContainer: {
    marginTop: 10,
  },
  campo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#5A00DD',
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
  },
  textoDado: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  botoesContainer: {
    paddingHorizontal: 20,
  },
  botao: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  botaoEditar: {
    backgroundColor: '#5A00DD',
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
  },
  botaoCancelar: {
    backgroundColor: '#FF4D6D',
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});