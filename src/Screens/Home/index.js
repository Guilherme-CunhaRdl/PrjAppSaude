import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Home() {
    const navigation = useNavigation();

    const ferramentas = [
        { icone: 'fitness-center', nome: 'IMC', tela: 'Imc' },
        { icone: 'local-drink', nome: 'Água', tela: 'Agua' },
        { icone: 'medication', nome: 'Remédios', tela: 'Remedio' },
        { icone: 'vaccines', nome: 'Vacinas', tela: 'Vacina' },
        { icone: 'nightlight-round', nome: 'Dicas para Dormir', tela: 'Dormir' },
        { icone: 'spa', nome: 'Mantras', tela: 'Mantras' },
        { icone: 'favorite', nome: 'Diabetes', tela: 'Diabetes' },
        { icone: 'favorite-border', nome: 'Pressão', tela: 'Pressao' },
        { icone: 'eco', nome: 'Nutrição', tela: 'Frutas' },
        { icone: 'format-quote', nome: 'Motivação', tela: 'Frases' },
        { icone: 'format-quote', nome: 'Login', tela: 'Login' },
        { icone: 'format-quote', nome: 'Cadastro', tela: 'Cadastro' }
    ];

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.statusContainer}>
                    <View style={styles.statusCard}>
                        <Text style={styles.statusValor}>72%</Text>
                        <Text style={styles.statusLabel}>Hidratação</Text>
                        <View style={styles.barraProgresso}>
                            <View style={[styles.barraPreenchimento, { width: '72%' }]} />
                        </View>
                    </View>
                    
                    <View style={styles.statusCard}>
                        <Text style={styles.statusValor}>72 bpm</Text>
                        <Text style={styles.statusLabel}>Frequência Cardíaca</Text>
                        <View style={styles.barraProgresso}>
                            <View style={[styles.barraPreenchimento, { width: '60%', backgroundColor: '#FF4D6D' }]} />
                        </View>
                    </View>
                </View>

 
                <Text style={styles.tituloSecao}>FERRAMENTAS</Text>
                <View style={styles.ferramentasGrid}>
                    {ferramentas.map((item, index) => (
                        <Pressable 
                            key={index}
                            style={styles.ferramentaCard}
                            onPress={() => navigation.navigate(item.tela)}
                        >
                            <LinearGradient
                                colors={['#7209B7', '#5A00A3']}
                                style={styles.ferramentaGradiente}
                            >
                                <Icon name={item.icone} size={26} color="#fff" style={styles.ferramentaIcone} />
                                <Text style={styles.ferramentaNome}>{item.nome}</Text>
                            </LinearGradient>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    conteudo: {
        paddingTop: 20, 
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statusCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 18,
        elevation: 3,
        shadowColor: '#3A0CA3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusValor: {
        fontSize: 26,
        fontWeight: '700',
        color: '#3A0CA3',
        textAlign: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 8,
    },
    barraProgresso: {
        height: 5,
        backgroundColor: '#EDF2F7',
        borderRadius: 3,
        overflow: 'hidden',
    },
    barraPreenchimento: {
        height: '100%',
        backgroundColor: '#7209B7',
        borderRadius: 3,
    },
    tituloSecao: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3A0CA3',
        marginBottom: 12,
        marginLeft: 5,
    },
    ferramentasGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    ferramentaCard: {
        width: '32%',
        height: 100,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    ferramentaGradiente: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    ferramentaIcone: {
        marginBottom: 6,
    },
    ferramentaNome: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
});