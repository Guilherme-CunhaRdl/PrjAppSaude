import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';


// Importações das suas telas (MANTIDAS EXATAMENTE COMO VOCÊ TEM)
import Home from '../Screens/Home';
import Imc from '../Screens/Imc';
import Agua from '../Screens/agua';
import Vacina from '../Screens/Vacina';
import Frutas from '../Screens/frutas';
import Login from '../Screens/login';
import Cadastro from '../Screens/cadastro';
import Frases from '../Screens/Frases';
import Remedio from '../Screens/remedio';
import Pressao from '../Screens/pressao';
import Perfil from  '../Screens/perfil';
import Geo from '../Screens/geo';
import Dormir from '../Screens/dormir';
import Mantras from '../Screens/mantras';  
import Diabetes from '../Screens/diabetes';

const Stack = createNativeStackNavigator();

const HeaderHome = ({ navigation }) => (
  <LinearGradient
    colors={['#5A00DD', '#7B2CBF']}
    style={styles.gradiente}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.conteudoHeader}>
      {/* Logo absolutamente centralizada */}
      <View style={styles.containerLogo}>
        <Icon name="eco" size={32} color="#fff" style={styles.iconeLogo} />
        <Text style={styles.titulo}>VITALIS</Text>
      </View>

      {/* Ícone de perfil no canto direito */}
      <Pressable 
        onPress={() => navigation.navigate('Perfil')} 
        style={styles.iconePerfil}
      >
        <Icon name="account-circle" size={28} color="#fff" />
      </Pressable>
    </View>
  </LinearGradient>
);


const HeaderApp = ({ navigation }) => (
  <LinearGradient
    colors={['#5A00DD', '#7B2CBF']}
    style={styles.gradiente}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.conteudoHeader}>
      {/* Botão Voltar no canto esquerdo */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.botaoVoltar}
      >
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Logo centralizada */}
      <View style={styles.containerLogo}>
        <Icon name="eco" size={28} color="#fff" style={styles.iconeLogo} />
        <Text style={styles.titulo}>VITALIS</Text>
      </View>

      {/* Ícone de perfil no canto direito */}
      <Pressable 
        onPress={() => navigation.navigate('Perfil')} 
        style={styles.iconePerfil}
      >
        <Icon name="account-circle" size={28} color="#fff" />
      </Pressable>
    </View>
  </LinearGradient>
);

export default function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
          },
        }}
      >



<Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />


<Stack.Screen 
          name="Geo" 
          component={Geo}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />


<Stack.Screen 
  name="Home" 
  component={Home}
  options={({ navigation }) => ({  
    header: () => <HeaderHome navigation={navigation} />,
  })}
/>









 
<Stack.Screen 
name="Perfil" 
component={Perfil} 
options={({ navigation }) => ({
  header: () => <HeaderApp navigation={navigation} />,
})}
/>
        <Stack.Screen 
          name="Imc" 
          component={Imc}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

<Stack.Screen 
          name="Mantras" 
          component={Mantras}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

        <Stack.Screen 
          name="Diabetes" 
          component={Diabetes}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

             <Stack.Screen 
          name="Agua" 
          component={Agua}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

            <Stack.Screen 
          name="Dormir" 
          component={Dormir}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />


        <Stack.Screen 
          name="Vacina" 
          component={Vacina}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

        <Stack.Screen 
          name="Frutas" 
          component={Frutas}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

        <Stack.Screen 
          name="Frases" 
          component={Frases}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

        <Stack.Screen 
          name="Remedio" 
          component={Remedio}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />

        <Stack.Screen 
          name="Pressao" 
          component={Pressao}
          options={({ navigation }) => ({
            header: () => <HeaderApp navigation={navigation} />,
          })}
        />
 
 
        
        <Stack.Screen 
          name="Cadastro" 
          component={Cadastro} 
          options={{ headerShown: false }} 
        />

 

      
     
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  gradiente: {
    height: 80,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 15, // Adicionado padding geral
  },
  conteudoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  containerLogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: -1,
  },
  iconeLogo: {
    marginRight: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  iconePerfil: {
    marginLeft: 'auto', // Garante posicionamento à direita
    padding: 8,
  },
  botaoVoltar: {
    padding: 8,
    zIndex: 1, // Garante que fique acima da logo
  },
});