import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useState } from "react";

export default function Frutas() {
    const [food, setFood] = useState("");
    const [nutritionData, setNutritionData] = useState(null);

    const fetchFoodData = async (food) => {
        const API_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients";
        const APP_ID = "ff1cdbe4";
        const APP_KEY = "055dbc209ae77820286afed6967d03d5";
    
        try {
            const response = await axios.post(API_URL, { query: food }, {
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": APP_ID,
                    "x-app-key": APP_KEY,
                },
            });
    
            console.log(response.data);
            // Pega apenas o primeiro item da resposta
            setNutritionData(response.data.foods[0]); 
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setNutritionData(null);
        }
    };

    return (
        <ScrollView contentContainerStyle={estilos.container}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <Icon name="local-florist" size={30} color="#6200ee" />
                <Text style={estilos.titulo}>Informações Nutricionais</Text>
            </View>

            {/* Campo de busca */}
            <View style={estilos.containerBusca}>
                <TextInput
                    style={estilos.inputBusca}
                    placeholder="Digite o nome da fruta"
                    placeholderTextColor="#999"
                    value={food}
                    onChangeText={setFood}
                />
                <TouchableOpacity 
                    style={estilos.botaoBusca} 
                    onPress={() => fetchFoodData(food)}
                    disabled={!food.trim()}
                >
                    <Icon name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Card da Fruta */}
            {nutritionData ? (
                <View style={estilos.cardFruta}>
                    <View style={estilos.cabecalhoCard}>
                        <Image 
                            style={estilos.imagemFruta} 
                            source={{ uri: nutritionData.photo?.thumb || 'https://via.placeholder.com/150' }} 
                        />
                        <Text style={estilos.nomeFruta}>{nutritionData.food_name}</Text>
                    </View>

                    <View style={estilos.separador} />

                    <View style={estilos.detalhesNutricionais}>
                        <Text style={estilos.tituloSecao}>Informação Nutricional</Text>
                        
                        <View style={estilos.itemNutricional}>
                            <View style={[estilos.iconeNutricional, { backgroundColor: '#fde2e2' }]}>
                                <Icon name="local-fire-department" size={20} color="#e74c3c" />
                            </View>
                            <View style={estilos.textoNutricional}>
                                <Text style={estilos.rotuloNutricional}>Calorias</Text>
                                <Text style={estilos.valorNutricional}>{nutritionData.nf_calories} kcal</Text>
                            </View>
                        </View>

                        <View style={estilos.itemNutricional}>
                            <View style={[estilos.iconeNutricional, { backgroundColor: '#e3f2fd' }]}>
                                <Icon name="pie-chart" size={20} color="#3498db" />
                            </View>
                            <View style={estilos.textoNutricional}>
                                <Text style={estilos.rotuloNutricional}>Carboidratos</Text>
                                <Text style={estilos.valorNutricional}>{nutritionData.nf_total_carbohydrate}g</Text>
                            </View>
                        </View>

                        <View style={estilos.itemNutricional}>
                            <View style={[estilos.iconeNutricional, { backgroundColor: '#f3e5f5' }]}>
                                <Icon name="cake" size={20} color="#9b59b6" />
                            </View>
                            <View style={estilos.textoNutricional}>
                                <Text style={estilos.rotuloNutricional}>Açúcares</Text>
                                <Text style={estilos.valorNutricional}>{nutritionData.nf_sugars}g</Text>
                            </View>
                        </View>

                        <View style={estilos.itemNutricional}>
                            <View style={[estilos.iconeNutricional, { backgroundColor: '#e8f5e9' }]}>
                                <Icon name="fitness-center" size={20} color="#2ecc71" />
                            </View>
                            <View style={estilos.textoNutricional}>
                                <Text style={estilos.rotuloNutricional}>Proteínas</Text>
                                <Text style={estilos.valorNutricional}>{nutritionData.nf_protein}g</Text>
                            </View>
                        </View>

                        <View style={estilos.itemNutricional}>
                            <View style={[estilos.iconeNutricional, { backgroundColor: '#fff3e0' }]}>
                                <Icon name="water-drop" size={20} color="#f39c12" />
                            </View>
                            <View style={estilos.textoNutricional}>
                                <Text style={estilos.rotuloNutricional}>Gorduras</Text>
                                <Text style={estilos.valorNutricional}>{nutritionData.nf_total_fat}g</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={estilos.placeholder}>
                    <Icon name="search-off" size={50} color="#bdc3c7" />
                    <Text style={estilos.textoPlaceholder}>
                       Busque uma fruta para ver suas informações
                    </Text>
                </View>
            )}
        </ScrollView>
    )
}

const estilos = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f8f9fa'
    },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        justifyContent: 'center'
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#2c3e50'
    },
    containerBusca: {
        flexDirection: 'row',
        marginBottom: 25,
        height: 50
    },
    inputBusca: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        elevation: 2
    },
    botaoBusca: {
        backgroundColor: '#6200ee',
        borderRadius: 10,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2
    },
    cardFruta: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cabecalhoCard: {
        alignItems: 'center',
        marginBottom: 15
    },
    imagemFruta: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#f0f0f0'
    },
    nomeFruta: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34495e',
        textAlign: 'center'
    },
    separador: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15
    },
    tituloSecao: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 15,
        textAlign: 'center'
    },
    detalhesNutricionais: {
        marginTop: 10
    },
    itemNutricional: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#fafafa',
        borderRadius: 10,
        padding: 12
    },
    iconeNutricional: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    textoNutricional: {
        flex: 1
    },
    rotuloNutricional: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 2
    },
    valorNutricional: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50'
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
    },
    textoPlaceholder: {
        fontSize: 16,
        color: '#bdc3c7',
        marginTop: 15,
        textAlign: 'center'
    }
});