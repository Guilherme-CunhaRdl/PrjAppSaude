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

const { width } = Dimensions.get("window");

export default function Remedio() {
    const [remedios, setRemedios] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [novoRemedio, setNovoRemedio] = useState({
        nome: "",
        dosagem: "",
        horario: "",
        frequencia: "",
        imagem: null,
    });


    useEffect(() => {
      const carregarRemedios = async () => {
          try {
              const resposta = await axios.get("http://127.0.0.1:8000/api/remedios");
              setRemedios(resposta.data); 
          } catch (erro) {
              console.error("Erro ao buscar remédios:", erro);
              Alert.alert("Erro", "Não foi possível carregar os remédios.");
          }
      };
  
      carregarRemedios();
  }, []);

    useEffect(() => {
        (async () => {
            await ImagePicker.requestCameraPermissionsAsync();
        })();
    }, []);

    const tirarFoto = async () => {
        let resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!resultado.canceled) {
            setNovoRemedio({ ...novoRemedio, imagem: resultado.assets[0].uri });
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
        // Validação dos campos
        if (!novoRemedio.nome) {
            Alert.alert("Aviso", "Digite o nome do remédio");
            return;
        }
    
        if (
            !novoRemedio.horario ||
            !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(novoRemedio.horario)
        ) {
            Alert.alert("Aviso", "Digite um horário válido no formato HH:MM");
            return;
        }
    
        const formData = new FormData();
        formData.append("nome", novoRemedio.nome);
        formData.append("dosagem", novoRemedio.dosagem || "");
        formData.append("horario", novoRemedio.horario);
        formData.append("frequencia", novoRemedio.frequencia || "Diário");
        formData.append("user_id", 1); // Substitua pelo ID real do usuário logado
    
        if (novoRemedio.imagem) {
            // Verifique se a imagem é base64
            if (novoRemedio.imagem.startsWith("data:image")) {
                const base64Response = await fetch(novoRemedio.imagem);
                const blob = await base64Response.blob();
    
                // Adiciona o blob ao FormData
                formData.append("imagem_path", blob, "foto.png");
            } else {
                // Caso contrário, apenas anexa o arquivo diretamente (caso tenha sido capturado com a câmera, por exemplo)
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
                "http://127.0.0.1:8000/api/remediosRegistrar",  // A URL correta do seu backend
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            console.log(response.data);
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
            console.error(error);
            Alert.alert(
                "Erro",
                "Não foi possível salvar. Verifique a conexão ou o servidor."
            );
        }
    };
    
    




    const removerRemedio = async  (id) => {
      try {
        const resposta = await axios.delete(`http://127.0.0.1:8000/api/remedios/${id}`);
        
        if (resposta.data.success) {
            // Filtra o remédio removido do estado local
            setRemedios(remedios.filter((remedio) => remedio.id !== id));
            Alert.alert("Sucesso", "Remédio excluído com sucesso!");
        } else {
            Alert.alert("Erro", "Não foi possível excluir o remédio.");
        }
    } catch (erro) {
        console.error("Erro ao excluir remédio:", erro);
        Alert.alert("Erro", "Não foi possível excluir o remédio.");
    }
    };




    return (
        <View style={estilos.container}>
            <View style={estilos.cabecalho}>
                <Icon name="medication" size={28} color="#5A00DD" />
                <Text style={estilos.tituloCabecalho}>Meus Remédios</Text>
                <TouchableOpacity onPress={() => setModalVisivel(true)}>
                    <Icon name="add-circle" size={28} color="#5A00DD" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={estilos.containerRemedios}>
                {remedios.length > 0 ? (
                    remedios.map((remedio) => (
                        <View key={remedio.id} style={estilos.cardRemedio}>
                            {remedio.imagem ? (
                                <Image
                                    source={{ uri: remedio.imagem }}
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
