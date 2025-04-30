import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const frasesMotivacionais = [
  "Acredite em você!",
  "Persista, não desista!",
  "Cada pequeno passo conta.",
  "Você é capaz!",
  "O sucesso vem com esforço."
];

export default function FrasesMotivacionais() {
  const [fraseAtual, setFraseAtual] = useState(0);
  const [animating, setAnimating] = useState(false);

  const mudarFrase = () => {
    if (animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      setFraseAtual((prev) => (prev + 1) % frasesMotivacionais.length);
      setAnimating(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation={animating ? "fadeOut" : "fadeIn"}
        duration={500}
        style={styles.card}
      >
        <Text style={styles.frase}>
          "{frasesMotivacionais[fraseAtual]}"
        </Text>
      </Animatable.View>

      <TouchableOpacity 
        style={styles.botao} 
        onPress={mudarFrase}
        disabled={animating}
      >
        <Animatable.Text 
          animation={animating ? "pulse" : undefined}
          iterationCount="infinite"
          style={styles.textoBotao}
        >
          Nova Frase
        </Animatable.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    elevation: 3,
  },
  frase: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
    color: '#333',
    fontStyle: 'italic',
  },
  botao: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});