import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Animated,
  Easing 
} from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Imc() {
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState(0);
  const [classificacao, setClassificacao] = useState('Insira seus dados');
  const [valorPreenchimento, setValorPreenchimento] = useState(0); // Estado para o preenchimento
  const animacao = new Animated.Value(0); // Para outras animações se precisar

  useEffect(() => {
    const alturaM = altura / 100;
    const valorIMC = alturaM && peso ? (peso / (alturaM * alturaM)) : 0;
    const imcCalc = parseFloat(valorIMC.toFixed(1));
    
    setImc(imcCalc);
    definirClassificacao(imcCalc);
    
    const novoProgresso = calcProgresso(imcCalc);
    
    // Animação suave do preenchimento
    Animated.timing(animacao, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Atualiza o valor do preenchimento
    const intervalo = setInterval(() => {
      setValorPreenchimento(prev => {
        const novoValor = prev + (novoProgresso - prev) * 0.1;
        return Math.abs(novoValor - novoProgresso) < 0.5 ? novoProgresso : novoValor;
      });
    }, 20); // ~60fps

    return () => clearInterval(intervalo);
  }, [altura, peso]);

  const calcProgresso = (valorIMC) => {
    if (!valorIMC) return 0;
    if (valorIMC < 15) return (valorIMC / 15) * 25;
    if (valorIMC > 40) return 100;
    return ((valorIMC - 15) / 25) * 100;
  };

  const definirClassificacao = (valorIMC) => {
    if (!altura || !peso) {
      setClassificacao('Insira seus dados');
    } else if (valorIMC < 18.5) {
      setClassificacao('Abaixo do peso');
    } else if (valorIMC < 25) {
      setClassificacao('Peso ideal');
    } else if (valorIMC < 30) {
      setClassificacao('Sobrepeso');
    } else if (valorIMC < 35) {
      setClassificacao('Obesidade I');
    } else if (valorIMC < 40) {
      setClassificacao('Obesidade II');
    } else {
      setClassificacao('Obesidade III');
    }
  };

  const obterCor = () => {
    switch(classificacao) {
      case 'Abaixo do peso': return '#FFC107';
      case 'Peso ideal': return '#4CAF50';
      case 'Sobrepeso': return '#FF9800';
      case 'Obesidade I': return '#F44336';
      case 'Obesidade II': return '#D32F2F';
      case 'Obesidade III': return '#B71C1C';
      default: return '#6200ee';
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.cabecalho}>
        <Icon name="calculate" size={32} color="#6200ee" />
        <Text style={estilos.titulo}>Calculadora de IMC</Text>
      </View>

      <View style={estilos.card}>
        <Text style={estilos.rotulo}>Altura (cm)</Text>
        <TextInput
          style={estilos.input}
          keyboardType="numeric"
          placeholder="Ex: 175"
          placeholderTextColor="#999"
          value={altura}
          onChangeText={setAltura}
        />

        <Text style={estilos.rotulo}>Peso (kg)</Text>
        <TextInput
          style={estilos.input}
          keyboardType="numeric"
          placeholder="Ex: 70"
          placeholderTextColor="#999"
          value={peso}
          onChangeText={setPeso}
        />
      </View>

      <View style={estilos.areaResultado}>
        <CircularProgress
          size={200}
          width={18}
          fill={valorPreenchimento} // Usando o estado diretamente
          tintColor={obterCor()}
          backgroundColor="#f0f0f0"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={estilos.conteudoCirculo}>
              <Text style={estilos.valorIMC}>
                {imc > 0 ? imc : '--'}
              </Text>
              <Text style={[estilos.textoClassificacao, { color: obterCor() }]}>
                {classificacao}
              </Text>
            </View>
          )}
        </CircularProgress>

        <View style={estilos.legenda}>
          {[
            { cor: '#FFC107', texto: 'Abaixo do peso (<18.5)' },
            { cor: '#4CAF50', texto: 'Peso ideal (18.5-24.9)' },
            { cor: '#FF9800', texto: 'Sobrepeso (25-29.9)' },
            { cor: '#F44336', texto: 'Obesidade I (30-34.9)' },
            { cor: '#D32F2F', texto: 'Obesidade II (35-39.9)' },
            { cor: '#B71C1C', texto: 'Obesidade III (≥40)' },
          ].map((item, index) => (
            <View key={index} style={estilos.itemLegenda}>
              <View style={[estilos.corLegenda, { backgroundColor: item.cor }]} />
              <Text style={estilos.textoLegenda}>{item.texto}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ee',
    marginLeft: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rotulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  areaResultado: {
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  conteudoCirculo: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  valorIMC: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  textoClassificacao: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  legenda: {
    width: '100%',
    marginTop: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  corLegenda: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 12,
  },
  textoLegenda: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
});