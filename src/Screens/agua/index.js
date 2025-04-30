import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Agua() {
  const metaDiaria = 2000;
  const [consumo, setConsumo] = useState(0);
  const quantidades = [100, 200, 300, 500];

  const adicionarAgua = (quantidade) => {
    const novoConsumo = Math.min(consumo + quantidade, metaDiaria);
    setConsumo(novoConsumo);
  };

  const resetarConsumo = () => {
    setConsumo(0);
  };

  const progresso = (consumo / metaDiaria) * 100;
  const metaAlcancada = consumo >= metaDiaria;

  const renderProgressBar = () => {
    const totalCirculos = 10;
    const circulosPreenchidos = Math.round((progresso / 100) * totalCirculos);
    
    return (
      <View style={styles.progressContainer}>
        {[...Array(totalCirculos)].map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.circuloProgresso,
              index < circulosPreenchidos ? styles.circuloPreenchido : styles.circuloVazio
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#5A00DD', '#7B2CBF']}
        style={styles.topo}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name="local-drink" size={50} color="#fff" />
        <Text style={styles.titulo}>Beber Água</Text>
        <Text style={styles.subtitulo}>Acompanhe seu consumo diário</Text>
      </LinearGradient>

      <View style={styles.cardMeta}>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Meta: {metaDiaria}ml</Text>
          <Text style={styles.consumoText}>Consumido: {consumo}ml</Text>
        </View>

        {renderProgressBar()}

        <Text style={styles.progressoTexto}>
          {Math.min(progresso, 100).toFixed(0)}% da meta
          {metaAlcancada && <Text style={styles.parabensText}> 🎉</Text>}
        </Text>
      </View>

      {!metaAlcancada ? (
        <>
          <View style={styles.botoesContainer}>
            {quantidades.map((qtd) => (
              <Pressable 
                key={qtd} 
                style={styles.botaoQuantidade}
                onPress={() => adicionarAgua(qtd)}
              >
                <Text style={styles.textoBotaoQuantidade}>+{qtd}ml</Text>
              </Pressable>
            ))}
          </View>

          <Pressable 
            style={styles.botaoGrande}
            onPress={() => adicionarAgua(250)}
          >
            <Icon name="add" size={30} color="white" />
            <Text style={styles.textoBotaoGrande}>Adicionar 250ml</Text>
          </Pressable>
        </>
      ) : (
        <Pressable 
          style={styles.botaoReset}
          onPress={resetarConsumo}
        >
          <Icon name="refresh" size={24} color="white" />
          <Text style={styles.textoBotaoReset}>Zerar contador</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  topo: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#3A0CA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardMeta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#3A0CA3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  subtitulo: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A0CA3',
  },
  consumoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A0CA3',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  circuloProgresso: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  circuloPreenchido: {
    backgroundColor: '#7209B7',
    transform: [{ scale: 1.1 }],
  },
  circuloVazio: {
    backgroundColor: '#EDF2F7',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  progressoTexto: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A0CA3',
    textAlign: 'center',
    marginBottom: 10,
  },
  parabensText: {
    color: '#FF4D6D',
  },
  botoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botaoQuantidade: {
    width: '48%',
    backgroundColor: '#F0EBFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  textoBotaoQuantidade: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A00DD',
  },
  botaoGrande: {
    width: '100%',
    backgroundColor: '#7209B7',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  textoBotaoGrande: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  botaoReset: {
    width: '100%',
    backgroundColor: '#FF4D6D',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  textoBotaoReset: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
});