import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert, 
  Modal, 
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Pressao() {
  const [registros, setRegistros] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState({
    frequencia: '',
    data: new Date().toISOString().split('T')[0],
    horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    observacao: ''
  });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const carregarToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
    };
    carregarToken();
  }, []);

  useEffect(() => {
    if (token) {
      carregarRegistros();
    }
  }, [token]);

  const carregarRegistros = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/frequencia-cardiaca', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRegistros(response.data);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os registros');
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const adicionarRegistro = async () => {
    if (!novoRegistro.frequencia) {
      Alert.alert('Aviso', 'Preencha a frequência cardíaca');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/frequencia-cardiaca',
        {
          frequencia: parseInt(novoRegistro.frequencia),
          data: novoRegistro.data,
          horario: novoRegistro.horario,
          observacao: novoRegistro.observacao
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRegistros([response.data, ...registros]);
      setModalVisivel(false);
      setNovoRegistro({
        frequencia: '',
        data: new Date().toISOString().split('T')[0],
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        observacao: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      Alert.alert('Erro', 'Não foi possível salvar o registro');
    }
  };

  const removerRegistro = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/frequencia-cardiaca/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRegistros(registros.filter(reg => reg.id !== id));
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      Alert.alert('Erro', 'Não foi possível remover o registro');
    }
  };

  return (
    <View style={estilos.container}>
      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <Icon name="favorite-border" size={28} color="#5A00DD" />
        <Text style={estilos.tituloCabecalho}>Frequência Cardíaca</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Icon name="add-circle" size={28} color="#5A00DD" />
        </TouchableOpacity>
      </View>

      {/* Lista de Registros */}
      <ScrollView contentContainerStyle={estilos.containerRegistros}>
        {registros.length > 0 ? (
          registros.map(registro => (
            <View key={registro.id} style={estilos.cardRegistro}>
              <View style={estilos.valorContainer}>
                <Text style={estilos.valorFrequencia}>{registro.frequencia}</Text>
                <Text style={estilos.unidade}>bpm</Text>
              </View>
              
              <View style={estilos.infoRegistro}>
                <View style={estilos.linhaDetalhe}>
                  <Icon name="schedule" size={16} color="#5A00DD" />
                  <Text style={estilos.textoDetalhe}>{registro.horario}</Text>
                </View>
                
                <View style={estilos.linhaDetalhe}>
                  <Icon name="calendar-today" size={16} color="#5A00DD" />
                  <Text style={estilos.textoDetalhe}>{formatarData(registro.data)}</Text>
                </View>
                
                {registro.observacao && (
                  <View style={estilos.linhaDetalhe}>
                    <Icon name="notes" size={16} color="#5A00DD" />
                    <Text style={estilos.textoDetalhe}>{registro.observacao}</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={estilos.botaoRemover}
                onPress={() => removerRegistro(registro.id)}
              >
                <Icon name="delete" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={estilos.listaVazia}>
            <View style={estilos.iconeListaVazia}>
              <Icon name="favorite-border" size={40} color="#5A00DD" />
            </View>
            <Text style={estilos.textoListaVazia}>Nenhum registro encontrado</Text>
            <Text style={estilos.subtextoListaVazia}>Toque no + para adicionar</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Adição */}
      <Modal
        animationType="slide"
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={estilos.containerModal}>
          <View style={estilos.cabecalhoModal}>
            <Text style={estilos.tituloModal}>Novo Registro</Text>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Icon name="close" size={24} color="#5A00DD" />
            </TouchableOpacity>
          </View>

          <ScrollView style={estilos.conteudoModal}>
            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Frequência Cardíaca (bpm) *</Text>
              <TextInput
                style={estilos.input}
                placeholder="Ex: 72"
                keyboardType="numeric"
                value={novoRegistro.frequencia}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, frequencia: texto})}
              />
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Data *</Text>
              <TextInput
                style={estilos.input}
                placeholder="AAAA-MM-DD"
                value={novoRegistro.data}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, data: texto})}
              />
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Horário *</Text>
              <TextInput
                style={estilos.input}
                placeholder="HH:MM"
                value={novoRegistro.horario}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, horario: texto})}
              />
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Observações</Text>
              <TextInput
                style={[estilos.input, { height: 80 }]}
                placeholder="Ex: Após caminhada"
                multiline
                value={novoRegistro.observacao}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, observacao: texto})}
              />
            </View>

            <TouchableOpacity 
              style={estilos.botaoSalvar}
              onPress={adicionarRegistro}
            >
              <Text style={estilos.textoBotaoSalvar}>Salvar Registro</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A00DD',
  },
  containerRegistros: {
    padding: 15,
  },
  cardRegistro: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 15,
  },
  valorFrequencia: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5A00DD',
  },
  unidade: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  infoRegistro: {
    flex: 1,
  },
  linhaDetalhe: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  textoDetalhe: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  botaoRemover: {
    padding: 8,
    marginLeft: 10,
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconeListaVazia: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F0EBFF',
  },
  textoListaVazia: {
    fontSize: 18,
    color: '#5A00DD',
    marginTop: 15,
    fontWeight: '600',
  },
  subtextoListaVazia: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5A00DD',
  },
  conteudoModal: {
    padding: 20,
  },
  grupoInput: {
    marginBottom: 20,
  },
  rotuloInput: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A00DD',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2DAFF',
  },
  botaoSalvar: {
    backgroundColor: '#5A00DD',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoSalvar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});