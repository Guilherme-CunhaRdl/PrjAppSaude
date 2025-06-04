import React, { useState } from 'react';
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

export default function Diabetes() {
  const [registros, setRegistros] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState({
    glicemia: '',
    tipo: 'Jejum',
    data: new Date().toLocaleDateString('pt-BR'),
    horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    observacao: ''
  });

  const tiposMedicao = ['Jejum', 'Pré-prandial', 'Pós-prandial', 'Aleatória'];

  const adicionarRegistro = () => {
    if (!novoRegistro.glicemia) {
      Alert.alert('Aviso', 'Preencha o valor da glicemia');
      return;
    }

    const registroParaAdicionar = {
      id: Date.now(),
      ...novoRegistro
    };

    setRegistros([...registros, registroParaAdicionar]);
    setModalVisivel(false);
    setNovoRegistro({
      glicemia: '',
      tipo: 'Jejum',
      data: new Date().toLocaleDateString('pt-BR'),
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      observacao: ''
    });
  };

  const removerRegistro = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
  };

  const getCorGlicemia = (valor) => {
    const glicemia = parseInt(valor);
    if (glicemia < 70) return '#FF5252'; // Hipoglicemia
    if (glicemia > 180) return '#FF9800'; // Hiperglicemia
    return '#4CAF50'; // Normal
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Icon name="favorite" size={28} color="#5A00DD" />
        <Text style={estilos.tituloCabecalho}>Controle Glicêmico</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Icon name="add-circle" size={28} color="#5A00DD" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={estilos.containerRegistros}>
        {registros.length > 0 ? (
          registros.map(registro => (
            <View key={registro.id} style={estilos.cardRegistro}>
              <View style={estilos.valorContainer}>
                <Text style={[estilos.valorGlicemia, { color: getCorGlicemia(registro.glicemia) }]}>
                  {registro.glicemia}
                </Text>
                <Text style={estilos.unidade}>mg/dL</Text>
                <View style={[estilos.tipoContainer, { backgroundColor: getCorGlicemia(registro.glicemia) }]}>
                  <Text style={estilos.textoTipo}>{registro.tipo}</Text>
                </View>
              </View>
              
              <View style={estilos.infoRegistro}>
                <View style={estilos.linhaDetalhe}>
                  <Icon name="schedule" size={16} color="#5A00DD" />
                  <Text style={estilos.textoDetalhe}>{registro.horario}</Text>
                </View>
                
                {registro.data && (
                  <View style={estilos.linhaDetalhe}>
                    <Icon name="calendar-today" size={16} color="#5A00DD" />
                    <Text style={estilos.textoDetalhe}>{registro.data}</Text>
                  </View>
                )}
                
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
              <Icon name="favorite" size={40} color="#5A00DD" />
            </View>
            <Text style={estilos.textoListaVazia}>Nenhum registro encontrado</Text>
            <Text style={estilos.subtextoListaVazia}>Toque no + para adicionar</Text>
          </View>
        )}
      </ScrollView>

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
              <Text style={estilos.rotuloInput}>Valor da Glicemia (mg/dL) *</Text>
              <TextInput
                style={estilos.input}
                placeholder="Ex: 120"
                keyboardType="numeric"
                value={novoRegistro.glicemia}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, glicemia: texto})}
              />
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Tipo de Medição *</Text>
              <View style={estilos.tiposContainer}>
                {tiposMedicao.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      estilos.botaoTipo,
                      novoRegistro.tipo === tipo && { 
                        backgroundColor: '#5A00DD',
                        borderColor: '#5A00DD'
                      }
                    ]}
                    onPress={() => setNovoRegistro({...novoRegistro, tipo})}
                  >
                    <Text style={[
                      estilos.textoBotaoTipo,
                      novoRegistro.tipo === tipo && { color: '#FFF' }
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Horário (opcional)</Text>
              <TextInput
                style={estilos.input}
                placeholder="HH:MM"
                value={novoRegistro.horario}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, horario: texto})}
              />
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Data (opcional)</Text>
              <TextInput
                style={estilos.input}
                placeholder="DD/MM/AAAA"
                value={novoRegistro.data}
                onChangeText={(texto) => setNovoRegistro({...novoRegistro, data: texto})}
              />
            </View>

            <View style={estilos.grupoInput}>
              <Text style={estilos.rotuloInput}>Observações (opcional)</Text>
              <TextInput
                style={[estilos.input, { height: 80 }]}
                placeholder="Ex: Após aplicação de insulina"
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
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 15,
    minWidth: 80,
  },
  valorGlicemia: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  unidade: {
    fontSize: 14,
    color: '#666',
    marginTop: -5,
  },
  tipoContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 5,
  },
  textoTipo: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
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
  tiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  botaoTipo: {
    width: '48%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2DAFF',
    marginBottom: 10,
    alignItems: 'center',
  },
  textoBotaoTipo: {
    color: '#5A00DD',
    fontSize: 14,
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