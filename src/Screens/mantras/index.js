import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av'; // Biblioteca de áudio do Expo

// Links de áudio reais (mantras royalty-free)
const mantras = [
  {
    id: 1,
    titulo: "Om Mani Padme Hum",
    duracao: "10:00",
    categoria: "Tibetano",
    imagem: 'https://i.imgur.com/7Jy9mZP.jpg',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Exemplo genérico
    cor: '#4A6FA5'
  },
  {
    id: 2,
    titulo: "Gayatri Mantra",
    duracao: "15:00",
    categoria: "Védico",
    imagem: 'https://i.imgur.com/5R5hQ9X.jpg',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cor: '#6B4D57'
  },
  {
    id: 3,
    titulo: "So Ham Meditation",
    duracao: "8:00",
    categoria: "Meditação",
    imagem: 'https://i.imgur.com/9Fq3WbD.jpg',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cor: '#166088'
  }
];

export default function Mantras() {
  const [mantraAtual, setMantraAtual] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [duracaoTotal, setDuracaoTotal] = useState(0);
  const [objetoAudio, setObjetoAudio] = useState(null);

  // Configura o áudio quando muda o mantra
  useEffect(() => {
    const configurarAudio = async () => {
      if (objetoAudio) {
        await objetoAudio.unloadAsync(); // Libera o áudio anterior
      }

      setCarregando(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: mantras[mantraAtual].audio },
        { shouldPlay: false }
      );
      
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setTempoDecorrido(status.positionMillis / 1000);
          setDuracaoTotal(status.durationMillis / 1000);
          setTocando(status.isPlaying);
        }
      });

      setObjetoAudio(sound);
      setCarregando(false);
    };

    configurarAudio();

    return () => {
      if (objetoAudio) {
        objetoAudio.unloadAsync();
      }
    };
  }, [mantraAtual]);

  // Controles do player
  const togglePlay = async () => {
    if (!objetoAudio) return;

    if (tocando) {
      await objetoAudio.pauseAsync();
    } else {
      await objetoAudio.playAsync();
    }
  };

  const proximoMantra = () => {
    setMantraAtual((prev) => (prev + 1) % mantras.length);
    setTempoDecorrido(0);
  };

  const mantraAnterior = () => {
    setMantraAtual((prev) => (prev - 1 + mantras.length) % mantras.length);
    setTempoDecorrido(0);
  };

  // Formata o tempo (segundos para MM:SS)
  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <LinearGradient colors={['#F8F9FA', '#E9ECEF']} style={estilos.container}>
      <Text style={estilos.titulo}>Mantras para Meditação</Text>
      
      {/* Player principal */}
      <View style={estilos.playerContainer}>
        <Image 
          source={{ uri: mantras[mantraAtual].imagem }} 
          style={estilos.capa}
          resizeMode="cover"
        />
        
        <View style={estilos.infoContainer}>
          <Text style={estilos.mantraTitulo}>{mantras[mantraAtual].titulo}</Text>
          <Text style={estilos.mantraCategoria}>{mantras[mantraAtual].categoria}</Text>
          
          {/* Barra de progresso */}
          <View style={estilos.barraProgressoContainer}>
            <View style={[
              estilos.barraProgresso,
              { 
                width: `${(tempoDecorrido / duracaoTotal) * 100}%`,
                backgroundColor: mantras[mantraAtual].cor
              }
            ]} />
          </View>
          
          <View style={estilos.tempoContainer}>
            <Text style={estilos.tempo}>{formatarTempo(tempoDecorrido)}</Text>
            <Text style={estilos.tempo}>{formatarTempo(duracaoTotal)}</Text>
          </View>
        </View>
      </View>
      
      {/* Controles */}
      <View style={estilos.controlesContainer}>
        <TouchableOpacity onPress={mantraAnterior} style={estilos.controle}>
          <Icon name="skip-previous" size={32} color="#3A0CA3" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={togglePlay} 
          style={[estilos.botaoPlay, { backgroundColor: mantras[mantraAtual].cor }]}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Icon 
              name={tocando ? "pause" : "play-arrow"} 
              size={36} 
              color="#FFF" 
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={proximoMantra} style={estilos.controle}>
          <Icon name="skip-next" size={32} color="#3A0CA3" />
        </TouchableOpacity>
      </View>
      
      {/* Lista de mantras */}
      <Text style={estilos.listaTitulo}>Sua Coleção</Text>
      <View style={estilos.listaContainer}>
        {mantras.map((mantra, index) => (
          <TouchableOpacity 
            key={mantra.id} 
            style={[
              estilos.mantraItem,
              index === mantraAtual && { 
                backgroundColor: '#F0F2F5',
                borderLeftWidth: 4,
                borderLeftColor: mantra.cor
              }
            ]}
            onPress={() => setMantraAtual(index)}
          >
            <Image source={{ uri: mantra.imagem }} style={estilos.mantraThumb} />
            <View style={estilos.mantraInfo}>
              <Text style={estilos.mantraNome}>{mantra.titulo}</Text>
              <Text style={estilos.mantraDetalhes}>{mantra.categoria} • {mantra.duracao}</Text>
            </View>
            <Icon 
              name={index === mantraAtual && tocando ? "pause" : "play-arrow"} 
              size={24} 
              color={index === mantraAtual ? mantra.cor : '#999'} 
            />
          </TouchableOpacity>
        ))}
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
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A0CA3',
    marginBottom: 20,
    textAlign: 'center',
  },
  playerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 25,
    overflow: 'hidden',
  },
  capa: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  mantraTitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  mantraCategoria: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  barraProgressoContainer: {
    height: 4,
    backgroundColor: '#EEE',
    borderRadius: 2,
    marginBottom: 5,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
    borderRadius: 2,
  },
  tempoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempo: {
    fontSize: 12,
    color: '#999',
  },
  controlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  controle: {
    padding: 15,
  },
  botaoPlay: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginHorizontal: 20,
  },
  listaTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A0CA3',
    marginBottom: 15,
    marginLeft: 5,
  },
  listaContainer: {
    marginBottom: 20,
  },
  mantraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  mantraThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  mantraInfo: {
    flex: 1,
  },
  mantraNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  mantraDetalhes: {
    fontSize: 12,
    color: '#999',
  },
});