import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Banco de frases completo (pode adicionar quantas quiser)
const frases = [
  {
    texto: "A persistência é o caminho do êxito!",
    autor: "Charles Chaplin",
    categoria: "Persistência",
    cor: "#7209B7"
  },
  {
    texto: "Acredite em milagres, mas não dependa deles.",
    autor: "Provérbio Chinês",
    categoria: "Fé",
    cor: "#3A0CA3"
  },
  {
    texto: "O sucesso nasce do querer, da determinação e persistência.",
    autor: "Desconhecido",
    categoria: "Sucesso",
    cor: "#4361EE"
  },
  {
    texto: "Você é mais forte do que imagina!",
    autor: "Desconhecido",
    categoria: "Força",
    cor: "#F72585"
  },
  {
    texto: "Nada é impossível para quem persiste.",
    autor: "Alexandre, o Grande",
    categoria: "Determinação",
    cor: "#4895EF"
  }
];

export default function FrasesMotivacionais() {
  const [fraseAtual, setFraseAtual] = useState(0);
  const [animando, setAnimando] = useState(false);
  const [fraseDoDia, setFraseDoDia] = useState(null);
  const [ultimaData, setUltimaData] = useState('');

  // Atualiza a frase do dia quando a data muda
  useEffect(() => {
    const dataHoje = new Date().toDateString(); // Ex: "Tue Jan 18 2022"
    
    if (dataHoje !== ultimaData) {
      const indiceDia = new Date().getDate() % frases.length;
      setFraseDoDia(frases[indiceDia]);
      setUltimaData(dataHoje);
      
      // Define uma frase inicial diferente da do dia
      let indiceInicial;
      do {
        indiceInicial = Math.floor(Math.random() * frases.length);
      } while (indiceInicial === indiceDia && frases.length > 1);
      
      setFraseAtual(indiceInicial);
    }
  }, []);

  const mudarFrase = () => {
    if (animando || frases.length <= 1) return;
    
    setAnimando(true);
    setTimeout(() => {
      let novaFrase;
      do {
        novaFrase = Math.floor(Math.random() * frases.length);
      } while (novaFrase === fraseAtual && frases.length > 1);
      
      setFraseAtual(novaFrase);
      setAnimando(false);
    }, 500);
  };

  const compartilharFrase = () => {
   
    console.log("Compartilhando frase:", frases[fraseAtual].texto);
  };

  return (
    <LinearGradient 
      colors={['#F8F9FA', '#E9ECEF']}
      style={estilos.container}
    >
      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Motivação Diária</Text>
        <TouchableOpacity onPress={compartilharFrase}>
          <Icon name="share" size={24} color="#3A0CA3" />
        </TouchableOpacity>
      </View>

      {/* Frase do Dia (muda só 1x por dia) */}
      <View style={estilos.containerDia}>
        <Text style={estilos.rotuloDia}>FRASE DO DIA</Text>
        <Animatable.View 
          animation="fadeIn"
          duration={1000}
          style={[estilos.cartaoDia, { backgroundColor: fraseDoDia?.cor }]}
        >
          <Icon name="event-available" size={22} color="#fff" style={{ opacity: 0.8 }} />
          <Text style={estilos.textoDia}>"{fraseDoDia?.texto}"</Text>
          <Text style={estilos.autorDia}>— {fraseDoDia?.autor}</Text>
        </Animatable.View>
      </View>

      {/* Frase Secundária (muda quando quiser) */}
      <Text style={estilos.rotuloSecundario}>MAIS INSPIRAÇÃO</Text>
      <Animatable.View 
        animation={animando ? "fadeOut" : "fadeIn"}
        duration={600}
        style={[estilos.cartaoSecundario, { borderLeftColor: frases[fraseAtual]?.cor }]}
      >
        <Text style={[estilos.categoria, { color: frases[fraseAtual]?.cor }]}>
          {frases[fraseAtual]?.categoria}
        </Text>
        <Text style={estilos.textoSecundario}>"{frases[fraseAtual]?.texto}"</Text>
        <Text style={estilos.autorSecundario}>— {frases[fraseAtual]?.autor}</Text>
      </Animatable.View>

      {/* Controles */}
      <View style={estilos.controles}>
        <TouchableOpacity 
          style={[estilos.botao, { backgroundColor: frases[fraseAtual]?.cor }]}
          onPress={mudarFrase}
          disabled={animando || frases.length <= 1}
        >
          <Animatable.Text
            animation={animando ? "pulse" : undefined}
            iterationCount="infinite"
            style={estilos.textoBotao}
          >
            <Icon name="autorenew" size={20} color="#fff" /> Trocar Frase
          </Animatable.Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de progresso */}
      <View style={estilos.progresso}>
        <Text style={estilos.contador}>
          {fraseAtual + 1}/{frases.length}
        </Text>
        <View style={estilos.pontosContainer}>
          {frases.map((_, index) => (
            <View 
              key={index} 
              style={[
                estilos.ponto,
                index === fraseAtual && {
                  backgroundColor: frases[fraseAtual]?.cor,
                  width: 10,
                  height: 10
                }
              ]} 
            />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A0CA3',
  },
  containerDia: {
    marginBottom: 30,
  },
  rotuloDia: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 5,
    letterSpacing: 1,
  },
  cartaoDia: {
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'flex-start',
  },
  textoDia: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 26,
    marginVertical: 12,
  },
  autorDia: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-end',
    fontStyle: 'italic',
  },
  rotuloSecundario: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 5,
    letterSpacing: 1,
  },
  cartaoSecundario: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoria: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textoSecundario: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    lineHeight: 24,
    marginVertical: 10,
    fontStyle: 'italic',
  },
  autorSecundario: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  controles: {
    marginBottom: 20,
  },
  botao: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progresso: {
    alignItems: 'center',
  },
  contador: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  pontosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DEE2E6',
    marginHorizontal: 4,
  },
});