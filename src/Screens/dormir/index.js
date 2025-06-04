import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Dormir() {
 const navigation = useNavigation();

    const dicas = [
        {
            titulo: "Rotina Regular",
            descricao: "Vá dormir e acorde no mesmo horário todos os dias, mesmo nos fins de semana.",
            icone: 'schedule'
        },
        {
            titulo: "Ambiente Confortável",
            descricao: "Mantenha seu quarto escuro, silencioso e com temperatura agradável (entre 18-22°C).",
            icone: 'dark-mode'
        },
        {
            titulo: "Desligue as Telas",
            descricao: "Evite celulares, TVs e computadores 1 hora antes de dormir - a luz azul prejudica o sono.",
            icone: 'screen-lock-portrait'
        },
        {
            titulo: "Cuidado com a Cafeína",
            descricao: "Evite café, chá preto e refrigerantes após as 16h.",
            icone: 'local-cafe'
        },
        {
            titulo: "Relaxe Antes de Dormir",
            descricao: "Tome um banho quente, leia um livro ou pratique meditação para acalmar a mente.",
            icone: 'spa'
        },
        {
            titulo: "Exercite-se Regularmente",
            descricao: "Atividade física melhora a qualidade do sono, mas evite exercícios intensos perto da hora de dormir.",
            icone: 'directions-run'
        }
    ];

    const beneficios = [
        { icone: 'mood', texto: "Melhora do humor" },
        { icone: 'fitness-center', texto: "Mais energia" },
        { icone: 'memory', texto: "Memória reforçada" },
        { icone: 'healing', texto: "Sistema imunológico" },
        { icone: 'monitor-heart-rate', texto: "Coração saudável" },
        { icone: 'auto-awesome', texto: "Pele rejuvenescida" }
    ];

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={styles.header}
                >
                    <Icon name="nightlight-round" size={30} color="#5A00A3" />
                    <Text style={styles.titulo}>Dicas para Dormir Melhor</Text>
                </View>

                <View style={styles.cardDestaque}>
                    <Text style={styles.cardDestaqueTexto}>
                        Uma boa noite de sono é essencial para saúde física e mental. Adultos precisam de 7-9 horas de sono por noite.
                    </Text>
                </View>

                <Text style={styles.tituloSecao}>DICAS PARA DORMIR MELHOR</Text>
                
                <View style={styles.dicasContainer}>
                    {dicas.map((dica, index) => (
                        <View key={index} style={styles.dicaCard}>
                            <LinearGradient
                                colors={['#7209B7', '#5A00A3']}
                                style={styles.dicaIconeContainer}
                            >
                                <Icon name={dica.icone} size={24} color="#fff" />
                            </LinearGradient>
                            <View style={styles.dicaTextoContainer}>
                                <Text style={styles.dicaTitulo}>{dica.titulo}</Text>
                                <Text style={styles.dicaDescricao}>{dica.descricao}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.tituloSecao}>BENEFÍCIOS DO SONO</Text>
                
                <View style={styles.beneficiosGrid}>
                    {beneficios.map((item, index) => (
                        <View key={index} style={styles.beneficioCard}>
                            <Icon name={item.icone} size={26} color="#7209B7" />
                            <Text style={styles.beneficioTexto}>{item.texto}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.cardFinal}>
                    <Text style={styles.cardFinalTitulo}>Qualidade do Sono</Text>
                    <Text style={styles.cardFinalTexto}>
                        Se você regularmente tem dificuldade para dormir ou se sente cansado após uma noite de sono, considere consultar um especialista em sono.
                    </Text>
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
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#5A00A3',
        marginLeft: 10,
    },
    cardDestaque: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#3A0CA3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    cardDestaqueTexto: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        textAlign: 'center',
    },
    tituloSecao: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3A0CA3',
        marginBottom: 12,
        marginLeft: 20,
    },
    dicasContainer: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    dicaCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#3A0CA3',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    dicaIconeContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dicaTextoContainer: {
        flex: 1,
    },
    dicaTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3A0CA3',
        marginBottom: 4,
    },
    dicaDescricao: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    beneficiosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    beneficioCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#3A0CA3',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    beneficioTexto: {
        fontSize: 13,
        color: '#555',
        marginTop: 8,
        textAlign: 'center',
    },
    cardFinal: {
        backgroundColor: '#7209B7',
        marginHorizontal: 15,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
    },
    cardFinalTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardFinalTexto: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 20,
        textAlign: 'center',
    },
});