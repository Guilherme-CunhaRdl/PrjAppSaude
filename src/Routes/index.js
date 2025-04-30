import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

const Stack = createNativeStackNavigator();


const HeaderHome = () => (
  <LinearGradient
    colors={['#5A00DD', '#7B2CBF']}
    style={styles.gradiente}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.conteudoHeader}>
      <View style={styles.containerLogo}>
        <Icon name="eco" size={32} color="#fff" style={styles.iconeLogo} />
        <Text style={styles.titulo}>VITALIS</Text>
      </View>
      <Icon name="account-circle" size={30} color="#fff" style={styles.iconePerfil} />
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.containerLogo}>
        <Icon name="eco" size={28} color="#fff" style={styles.iconeLogo} />
        <Text style={styles.titulo}>VITALIS</Text>
      </View>
      <View style={styles.espacoDireita} />
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
          name="Home" 
          component={Home}
          options={{
            header: () => <HeaderHome />,
          }}
        />

 
        <Stack.Screen 
          name="Imc" 
          component={Imc}
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
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
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
  },
  conteudoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    height: '100%',
  },
  containerLogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginLeft: 'auto',
  },
  botaoVoltar: {
    zIndex: 1,
    padding: 10,
  },
  espacoDireita: {
    width: 40,
  },
});