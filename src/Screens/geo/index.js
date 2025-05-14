import React, { useState, useEffect } from "react";

import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
 
export default function Geo() {
    const navigation = useNavigation();
    const [modalVisivel, setModalVisivel] = useState(false);

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
 

            <View style={styles.viewSearch}>
            <Text style={styles.textHeader}>Veja as <span style={{color:'#5A00A3', fontWeight: 700,}}>academias</span> próximas</Text>


                <Pressable style={styles.circleSearch}
                onPress={() => setModalVisivel(true)}>
                <Icon name="search" size={65} color="#fff"/>
                </Pressable>
            </View>

            </ScrollView>

            <Modal
                animationType="slide"
                visible={modalVisivel}
                onRequestClose={() => setModalVisivel(false)}
            >
            </Modal>
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
 
    textHeader: {
        fontSize: 25,
        fontWeight: 600,
    },
    circleSearch: {
        width: 120,
        height: 120,
        borderRadius: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5A00A3',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 14, 
    },
    viewSearch: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        gap: 22,
    },
   
});