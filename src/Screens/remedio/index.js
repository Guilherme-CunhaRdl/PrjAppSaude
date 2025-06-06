import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    Alert,
    Modal,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function Remedio() {
    const [remedios, setRemedios] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [novoRemedio, setNovoRemedio] = useState({
        nome: "",
        dosagem: "",
        horario: "",
        frequencia: "",
        imagem: null,
    });
    const [remedioEditando, setRemedioEditando] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const carregarToken = async () => {
            const storedToken = await AsyncStorage.getItem('authToken');
            setToken(storedToken);
        };
        carregarToken();
    }, []);

    useEffect(() => {
        const carregarRemedios = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const resposta = await axios.get("http://127.0.0.1:8000/api/remedios", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRemedios(resposta.data); 
            } catch (erro) {
                console.error("Erro ao buscar remédios:", erro);
                Alert.alert("Erro", "Não foi possível carregar os remédios.");
            }
        };

        if (token) {
            carregarRemedios();
        }
    }, [token]);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera para tirar fotos');
            }
        })();
    }, []);

    const tirarFoto = async () => {
        try {
            let resultado = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!resultado.canceled && resultado.assets) {
                setNovoRemedio({ ...novoRemedio, imagem: resultado.assets[0].uri });
            }
        } catch (error) {
            console.error("Erro ao acessar câmera:", error);
            Alert.alert("Erro", "Não foi possível acessar a câmera");
        }
    };

    const formatarHorario = (texto) => {
        if (texto.length <= 5) {
            if (texto.length === 2 && !novoRemedio.horario.includes(":")) {
                texto += ":";
            }
            setNovoRemedio({ ...novoRemedio, horario: texto });
        }
    };

    const adicionarRemedio = async () => {
        if (!token) {
            Alert.alert("Erro", "Usuário não autenticado");
            return;
        }

        if (!novoRemedio.nome) {
            Alert.alert("Aviso", "Digite o nome do remédio");
            return;
        }
    
        if (!novoRemedio.horario || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(novoRemedio.horario)) {
            Alert.alert("Aviso", "Digite um horário válido no formato HH:MM");
            return;
        }
    
        const formData = new FormData();
        formData.append("nome", novoRemedio.nome);
        formData.append("dosagem", novoRemedio.dosagem || "");
        formData.append("horario", novoRemedio.horario);
        formData.append("frequencia", novoRemedio.frequencia || "Diário");
        
        if (novoRemedio.imagem) {
            if (novoRemedio.imagem.startsWith("data:image")) {
                const base64Response = await fetch(novoRemedio.imagem);
                const blob = await base64Response.blob();
                formData.append("imagem_path", blob, "foto.png");
            } else {
                const nomeArquivo = novoRemedio.imagem.split("/").pop();
                const tipoMime = nomeArquivo.split(".").pop();
                formData.append("imagem_path", {
                    uri: novoRemedio.imagem,
                    name: nomeArquivo,
                    type: `image/${tipoMime}`,
                });
            }
        }
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/remedios",
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    transformRequest: () => formData
                }
            );
    
            setRemedios([...remedios, response.data]);
            setModalVisivel(false);
            setNovoRemedio({
                nome: "",
                dosagem: "",
                horario: "",
                frequencia: "",
                imagem: null,
            });
            Alert.alert("Sucesso!", "Remédio salvo com sucesso!");
        } catch (error) {
            console.error("Erro detalhado:", error);
            Alert.alert(
                "Erro",
                error.response?.data?.message || "Erro ao salvar. Verifique os dados e tente novamente."
            );
        }
    };

    const abrirModalEdicao = (remedio) => {
        setRemedioEditando(remedio);
        setNovoRemedio({
            nome: remedio.nome,
            dosagem: remedio.dosagem,
            horario: remedio.horario,
            frequencia: remedio.frequencia,
            imagem: remedio.imagem_path ? `http://127.0.0.1:8000/uploads/${remedio.imagem_path}` : null,
        });
        setModalEditarVisivel(true);
    };

    const atualizarRemedio = async () => {
        if (!token || !remedioEditando) {
            Alert.alert("Erro", "Usuário não autenticado ou remédio inválido");
            return;
        }
    
        // Validação dos campos
        if (!novoRemedio.nome) {
            Alert.alert("Aviso", "Digite o nome do remédio");
            return;
        }
        
        if (!novoRemedio.horario || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(novoRemedio.horario)) {
            Alert.alert("Aviso", "Digite um horário válido no formato HH:MM");
            return;
        }
    
        const formData = new FormData();
        formData.append('nome', novoRemedio.nome);
        formData.append('dosagem', novoRemedio.dosagem || '');
        formData.append('horario', novoRemedio.horario);
        formData.append('frequencia', novoRemedio.frequencia || 'Diário');
    
        // Tratamento especial para imagens
        if (novoRemedio.imagem && !novoRemedio.imagem.startsWith('http')) {
            const uriParts = novoRemedio.imagem.split('.');
            const fileType = uriParts[uriParts.length - 1];
            
            formData.append('imagem_path', {
                uri: novoRemedio.imagem,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });
        }
    
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/remedios/${remedioEditando.id}/update`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                }
            );
    
            if (response.data.success) {
                setRemedios(remedios.map(r => 
                    r.id === remedioEditando.id ? response.data.data : r
                ));
                setModalEditarVisivel(false);
                Alert.alert("Sucesso!", "Remédio atualizado com sucesso!");
            }
        } catch (error) {
            console.error("Erro completo:", {
                message: error.message,
                response: error.response?.data,
                request: error.request
            });
            
            let errorMessage = "Erro ao atualizar. Verifique os dados e tente novamente.";
            
            if (error.response?.data?.errors) {
                errorMessage = Object.values(error.response.data.errors).join('\n');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert("Erro", errorMessage);
        }
    };

    const removerRemedio = async (id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const resposta = await axios.delete(`http://127.0.0.1:8000/api/remedios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (resposta.data.success) {
                setRemedios(remedios.filter((remedio) => remedio.id !== id));
                Alert.alert("Sucesso", "Remédio excluído com sucesso!");
            } else {
                Alert.alert("Erro", resposta.data.message || "Não foi possível excluir o remédio.");
            }
        } catch (erro) {
            console.error("Erro ao excluir remédio:", erro);
            Alert.alert(
                "Erro",
                erro.response?.data?.message || "Não foi possível excluir o remédio."
            );
        }
    };

    return (
        <View style={estilos.container}>
            <View style={estilos.cabecalho}>
                <Icon name="medication" size={28} color="#5A00DD" />
                <Text style={estilos.tituloCabecalho} >"Meus Remédios"</Text>
                <TouchableOpacity onPress={() => setModalVisivel(true)}>
                    <Icon name="add-circle" size={28} color="#5A00DD" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={estilos.containerRemedios}>
                {remedios.length > 0 ? (
                    remedios.map((remedio) => (
                        <View key={remedio.id} style={estilos.cardRemedio}>
                            {remedio.imagem_path ? (
                                <Image
                                    source={{ uri: `http://127.0.0.1:8000/uploads/${remedio.imagem_path}` }}
                                    style={estilos.imagemRemedio}
                                />
                            ) : (
                                <View style={estilos.iconeRemedio}>
                                    <Icon
                                        name="medication"
                                        size={30}
                                        color="#5A00DD"
                                    />
                                </View>
                            )}

                            <View style={estilos.infoRemedio}>
                                <Text style={estilos.nomeRemedio}>
                                    {remedio.nome}
                                </Text>

                                <View style={estilos.linhaDetalhe}>
                                    <Icon
                                        name="schedule"
                                        size={18}
                                        color="#5A00DD"
                                        style={estilos.iconeDetalhe}
                                    />
                                    <Text style={estilos.textoDetalhe}>
                                        {remedio.horario}
                                    </Text>
                                </View>

                                {remedio.dosagem && (
                                    <View style={estilos.linhaDetalhe}>
                                        <Icon
                                            name="science"
                                            size={18}
                                            color="#5A00DD"
                                            style={estilos.iconeDetalhe}
                                        />
                                        <Text style={estilos.textoDetalhe}>
                                            {remedio.dosagem}
                                        </Text>
                                    </View>
                                )}

                                {remedio.frequencia && (
                                    <View style={estilos.linhaDetalhe}>
                                        <Icon
                                            name="repeat"
                                            size={18}
                                            color="#5A00DD"
                                            style={estilos.iconeDetalhe}
                                        />
                                        <Text style={estilos.textoDetalhe}>
                                            {remedio.frequencia}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                style={estilos.botaoEditar}
                                onPress={() => abrirModalEdicao(remedio)}
                            >
                                <Icon name="edit" size={24} color="#5A00DD" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={estilos.botaoRemover}
                                onPress={() => removerRemedio(remedio.id)}
                            >
                                <Icon name="delete" size={24} color="#ff4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={estilos.listaVazia}>
                        <View style={estilos.iconeListaVazia}>
                            <Icon name="medication" size={40} color="#5A00DD" />
                        </View>
                        <Text style={estilos.textoListaVazia}>
                            Nenhum remédio agendado
                        </Text>
                        <Text style={estilos.subtextoListaVazia}>
                            Toque no + para adicionar
                        </Text>
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
                        <Text style={estilos.tituloModal}>Novo Remédio</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisivel(false)}
                        >
                            <Icon name="close" size={24} color="#5A00DD" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={estilos.conteudoModal}>
                        <TouchableOpacity
                            style={estilos.botaoImagem}
                            onPress={tirarFoto}
                        >
                            {novoRemedio.imagem ? (
                                <Image
                                    source={{ uri: novoRemedio.imagem }}
                                    style={estilos.previaImagem}
                                />
                            ) : (
                                <View style={estilos.placeholderImagem}>
                                    <Icon
                                        name="add-a-photo"
                                        size={30}
                                        color="#5A00DD"
                                    />
                                    <Text style={estilos.textoBotaoImagem}>
                                        Foto do remédio (opcional)
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={estilos.grupoInput}>
                            <Text style={estilos.rotuloInput}>
                                Nome do Remédio *
                            </Text>
                            <TextInput
                                style={estilos.input}
                                placeholder="Ex: Paracetamol"
                                value={novoRemedio.nome}
                                onChangeText={(texto) =>
                                    setNovoRemedio({
                                        ...novoRemedio,
                                        nome: texto,
                                    })
                                }
                            />
                        </View>

                        <View style={estilos.grupoInput}>
                            <Text style={estilos.rotuloInput}>Horário *</Text>
                            <TextInput
                                style={estilos.input}
                                placeholder="HH:MM (Ex: 08:30)"
                                value={novoRemedio.horario}
                                onChangeText={formatarHorario}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>

                        <View style={estilos.grupoInput}>
                            <Text style={estilos.rotuloInput}>
                                Dosagem (opcional)
                            </Text>
                            <TextInput
                                style={estilos.input}
                                placeholder="Ex: 500mg"
                                value={novoRemedio.dosagem}
                                onChangeText={(texto) =>
                                    setNovoRemedio({
                                        ...novoRemedio,
                                        dosagem: texto,
                                    })
                                }
                            />
                        </View>

                        <TouchableOpacity
                            style={estilos.botaoSalvar}
                            onPress={adicionarRemedio}
                        >
                            <Text style={estilos.textoBotaoSalvar}>
                                Salvar Remédio
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                visible={modalEditarVisivel}
                onRequestClose={() => setModalEditarVisivel(false)}
            >
                <View style={estilos.containerModal}>
                    <View style={estilos.cabecalhoModal}>
                        <Text style={estilos.tituloModal}>Editar Remédio</Text>
                        <TouchableOpacity
                            onPress={() => setModalEditarVisivel(false)}
                        >
                            <Icon name="close" size={24} color="#5A00DD" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={estilos.conteudoModal}>
                        <TouchableOpacity
                            style={estilos.botaoImagem}
                            onPress={tirarFoto}
                        >
                            {novoRemedio.imagem ? (
                                <Image
                                    source={{ uri: novoRemedio.imagem }}
                                    style={estilos.previaImagem}
                                />
                            ) : (
                                <View style={estilos.placeholderImagem}>
                                    <Icon
                                        name="add-a-photo"
                                        size={30}
                                        color="#5A00DD"
                                    />
                                    <Text style={estilos.textoBotaoImagem}>
                                        Alterar foto do remédio (opcional)
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={estilos.grupoInput}>
                            <Text style={estilos.rotuloInput}>
                                Nome do Remédio *
                            </Text>
                            <TextInput
                                style={estilos.input}
                                placeholder="Ex: Paracetamol"
                                value={novoRemedio.nome}
                                onChangeText={(texto) =>
                                    setNovoRemedio({
                                        ...novoRemedio,
                                        nome: texto,
                                    })
                                }
                            />
                        </View>

                        <View style={estilos.grupoInput}>
                            <Text style={estilos.rotuloInput}>Horário *</Text>
                            <TextInput
                                style={estilos.input}
                                placeholder="HH:MM (Ex: 08:30)"
                                value={novoRemedio.horario}
                                onChangeText={formatarHorario}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>

                        <View style={estilos.grupoInput}>
                            <Text style={estilos.rotuloInput}>
                                Dosagem (opcional)
                            </Text>
                            <TextInput
                                style={estilos.input}
                                placeholder="Ex: 500mg"
                                value={novoRemedio.dosagem}
                                onChangeText={(texto) =>
                                    setNovoRemedio({
                                        ...novoRemedio,
                                        dosagem: texto,
                                    })
                                }
                            />
                        </View>

                        <TouchableOpacity
                            style={estilos.botaoSalvar}
                            onPress={atualizarRemedio}
                        >
                            <Text style={estilos.textoBotaoSalvar}>
                                Atualizar Remédio
                            </Text>
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
        backgroundColor: "#F8F9FA",
    },
    cabecalho: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
    },
    tituloCabecalho: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#5A00DD",
    },
    containerRemedios: {
        padding: 15,
    },
    cardRemedio: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imagemRemedio: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 15,
    },
    iconeRemedio: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0EBFF",
    },
    infoRemedio: {
        flex: 1,
    },
    nomeRemedio: {
        fontSize: 18,
        fontWeight: "600",
        color: "#5A00DD",
        marginBottom: 8,
    },
    linhaDetalhe: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    iconeDetalhe: {
        marginRight: 8,
    },
    textoDetalhe: {
        fontSize: 15,
        color: "#555",
    },
    botaoEditar: {
        padding: 8,
        marginLeft: 10,
    },
    botaoRemover: {
        padding: 8,
        marginLeft: 10,
    },
    listaVazia: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    iconeListaVazia: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#F0EBFF",
    },
    textoListaVazia: {
        fontSize: 18,
        color: "#5A00DD",
        marginTop: 15,
        fontWeight: "600",
    },
    subtextoListaVazia: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    containerModal: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    cabecalhoModal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
    },
    tituloModal: {
        fontSize: 20,
        fontWeight: "600",
        color: "#5A00DD",
    },
    conteudoModal: {
        padding: 20,
    },
    botaoImagem: {
        alignItems: "center",
        marginBottom: 20,
    },
    placeholderImagem: {
        width: 150,
        height: 150,
        borderRadius: 12,
        backgroundColor: "#F0EBFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2DAFF",
    },
    previaImagem: {
        width: 150,
        height: 150,
        borderRadius: 12,
    },
    textoBotaoImagem: {
        marginTop: 10,
        color: "#5A00DD",
        fontSize: 14,
    },
    grupoInput: {
        marginBottom: 20,
    },
    rotuloInput: {
        fontSize: 14,
        fontWeight: "500",
        color: "#5A00DD",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E2DAFF",
    },
    botaoSalvar: {
        backgroundColor: "#5A00DD",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginTop: 20,
    },
    textoBotaoSalvar: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});