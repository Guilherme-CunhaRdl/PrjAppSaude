import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Vacinas() {
  const [categoriaExpandida, setCategoriaExpandida] = useState(null);

  // Todas as vacinas organizadas por categoria e idade
  const categorias = [
    {
      id: 1,
      nome: 'Bebês (0-2 anos)',
      icone: 'child-care',
      cor: '#4e7df1',
      vacinas: [
        {
          idade: 'Ao nascer',
          itens: [
            { nome: 'BCG-ID', descricao: 'Formas graves de tuberculose', dose: 'Dose única' },
            { nome: 'Hepatite B', descricao: 'Hepatite B', dose: '1ª dose' }
          ]
        },
        {
          idade: '2 meses',
          itens: [
            { nome: 'Pentavalente', descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib', dose: '1ª dose' },
            { nome: 'VIP', descricao: 'Poliomielite inativada', dose: '1ª dose' },
            { nome: 'Pneumocócica 10V', descricao: 'Doenças por pneumococo', dose: '1ª dose' },
            { nome: 'Rotavírus', descricao: 'Diarreia por rotavírus', dose: '1ª dose' }
          ]
        },
        {
          idade: '3 meses',
          itens: [
            { nome: 'Meningocócica C', descricao: 'Doença meningocócica C', dose: '1ª dose' }
          ]
        },
        {
          idade: '4 meses',
          itens: [
            { nome: 'Pentavalente', descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib', dose: '2ª dose' },
            { nome: 'VIP', descricao: 'Poliomielite inativada', dose: '2ª dose' },
            { nome: 'Pneumocócica 10V', descricao: 'Doenças por pneumococo', dose: '2ª dose' },
            { nome: 'Rotavírus', descricao: 'Diarreia por rotavírus', dose: '2ª dose' }
          ]
        },
        {
          idade: '5 meses',
          itens: [
            { nome: 'Meningocócica C', descricao: 'Doença meningocócica C', dose: '2ª dose' }
          ]
        },
        {
          idade: '6 meses',
          itens: [
            { nome: 'Pentavalente', descricao: 'Difteria, tétano, coqueluche, hepatite B e Hib', dose: '3ª dose' },
            { nome: 'VIP', descricao: 'Poliomielite inativada', dose: '3ª dose' }
          ]
        },
        {
          idade: '9 meses',
          itens: [
            { nome: 'Febre Amarela', descricao: 'Febre amarela', dose: 'Dose inicial' }
          ]
        },
        {
          idade: '12 meses',
          itens: [
            { nome: 'Tríplice Viral', descricao: 'Sarampo, caxumba e rubéola', dose: '1ª dose' },
            { nome: 'Pneumocócica 10V', descricao: 'Reforço', dose: '1º reforço' },
            { nome: 'Meningocócica C', descricao: 'Reforço', dose: '1º reforço' }
          ]
        },
        {
          idade: '15 meses',
          itens: [
            { nome: 'DTP', descricao: 'Difteria, tétano e coqueluche', dose: '1º reforço' },
            { nome: 'Hepatite A', descricao: 'Hepatite A', dose: 'Dose única' },
            { nome: 'Tetra Viral', descricao: 'Sarampo, caxumba, rubéola e varicela', dose: '2ª dose' }
          ]
        }
      ]
    },
    {
      id: 2,
      nome: 'Crianças (4-10 anos)',
      icone: 'directions-run',
      cor: '#6a4ce7',
      vacinas: [
        {
          idade: '4 anos',
          itens: [
            { nome: 'DTP', descricao: 'Difteria, tétano e coqueluche', dose: '2º reforço' },
            { nome: 'VIP', descricao: 'Poliomielite inativada', dose: 'Reforço' },
            { nome: 'Varicela', descricao: 'Catapora', dose: '2ª dose (se não tomou tetra viral)' }
          ]
        },
        {
          idade: '5-10 anos',
          itens: [
            { nome: 'HPV', descricao: 'Papilomavírus humano', dose: '2 doses (6 meses de intervalo)' }
          ]
        }
      ]
    },
    {
      id: 3,
      nome: 'Adolescentes (11-19 anos)',
      icone: 'school',
      cor: '#e74c9e',
      vacinas: [
        {
          idade: '11-14 anos',
          itens: [
            { nome: 'HPV', descricao: 'Papilomavírus humano', dose: '2 doses (6 meses de intervalo)' },
            { nome: 'Meningocócica ACWY', descricao: 'Doenças meningocócicas', dose: 'Dose única ou reforço' },
            { nome: 'dTpa', descricao: 'Difteria, tétano e coqueluche', dose: 'Reforço' }
          ]
        },
        {
          idade: '15-19 anos',
          itens: [
            { nome: 'Hepatite B', descricao: '3 doses (se não vacinado)', dose: 'Esquema 0-1-6 meses' },
            { nome: 'Febre Amarela', descricao: 'Dose única (se não vacinado)', dose: 'Validade vitalícia' }
          ]
        }
      ]
    },
    {
      id: 4,
      nome: 'Adultos (20-59 anos)',
      icone: 'person',
      cor: '#4ce7af',
      vacinas: [
        {
          idade: '20-59 anos',
          itens: [
            { nome: 'Hepatite B', descricao: '3 doses (se não vacinado)', dose: 'Esquema 0-1-6 meses' },
            { nome: 'Tríplice Viral', descricao: 'Sarampo, caxumba e rubéola', dose: '2 doses até 29 anos (1 dose até 49)' },
            { nome: 'dT', descricao: 'Difteria e tétano', dose: 'Reforço a cada 10 anos' },
            { nome: 'Febre Amarela', descricao: 'Dose única (se não vacinado)', dose: 'Validade vitalícia' }
          ]
        }
      ]
    },
    {
      id: 5,
      nome: 'Idosos (60+ anos)',
      icone: 'elderly',
      cor: '#e7a84c',
      vacinas: [
        {
          idade: '60+ anos',
          itens: [
            { nome: 'Influenza', descricao: 'Gripe', dose: 'Dose anual' },
            { nome: 'Pneumocócica 23V', descricao: 'Pneumonia, meningite', dose: '1 dose (repetir após 5 anos em alguns casos)' },
            { nome: 'Herpes Zóster', descricao: 'Cobreiro', dose: 'Dose única' }
          ]
        }
      ]
    },
    {
      id: 6,
      nome: 'Gestantes',
      icone: 'pregnant-woman',
      cor: '#f06292',
      vacinas: [
        {
          idade: 'Qualquer período',
          itens: [
            { nome: 'dTpa', descricao: 'Difteria, tétano e coqueluche', dose: 'A cada gestação (a partir da 20ª semana)' },
            { nome: 'Influenza', descricao: 'Gripe', dose: 'Dose anual' }
          ]
        }
      ]
    }
  ];

  const toggleCategoria = (id) => {
    setCategoriaExpandida(categoriaExpandida === id ? null : id);
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.cabecalho}>
        <Icon name="vaccines" size={40} color="#6200ee" />
        <Text style={estilos.titulo}>Calendário Nacional de Vacinação</Text>
        <Text style={estilos.subtitulo}>Toque em uma categoria para ver as vacinas</Text>
      </View>

      {categorias.map((categoria) => (
        <View key={categoria.id} style={estilos.grupoCategoria}>
          <TouchableOpacity 
            style={[estilos.cardCategoria, { backgroundColor: categoria.cor }]}
            onPress={() => toggleCategoria(categoria.id)}
            activeOpacity={0.8}
          >
            <View style={estilos.cabecalhoCard}>
              <Icon name={categoria.icone} size={24} color="white" />
              <Text style={estilos.tituloCard}>{categoria.nome}</Text>
            </View>
            <Icon 
              name={categoriaExpandida === categoria.id ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          {categoriaExpandida === categoria.id && (
            <View style={estilos.conteudoExpandido}>
              {categoria.vacinas.map((grupo, index) => (
                <View key={index}>
                  <Text style={[estilos.tituloIdade, { color: categoria.cor }]}>
                    {grupo.idade}
                  </Text>
                  
                  {grupo.itens.map((vacina, idx) => (
                    <View key={idx} style={estilos.cardVacina}>
                      <View style={estilos.iconeVacina}>
                        <Icon name="medical-services" size={20} color={categoria.cor} />
                      </View>
                      <View style={estilos.infoVacina}>
                        <Text style={estilos.nomeVacina}>{vacina.nome}</Text>
                        <Text style={estilos.descVacina}>{vacina.descricao}</Text>
                        <View style={estilos.doseContainer}>
                          <Icon name="schedule" size={14} color="#666" />
                          <Text style={estilos.doseVacina}>{vacina.dose}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={estilos.rodape}>
        <Text style={estilos.textoRodape}>
          <Icon name="update" size={16} color="#6200ee" /> Atualizado em {new Date().getFullYear()} conforme PNI
        </Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 25,
  },
  cabecalho: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
    elevation: 2,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  grupoCategoria: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  cardCategoria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tituloCard: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  conteudoExpandido: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
    elevation: 1,
  },
  tituloIdade: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    paddingLeft: 8,
  },
  cardVacina: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  iconeVacina: {
    marginRight: 12,
  },
  infoVacina: {
    flex: 1,
  },
  nomeVacina: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  descVacina: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  doseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doseVacina: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  rodape: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  textoRodape: {
    fontSize: 13,
    color: '#6200ee',
    fontWeight: '500',
  },
});