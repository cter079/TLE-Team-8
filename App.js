import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login  from './Webpages/Login';
import Home from './Webpages/Home';
import Register from './Register';
import Menu from './Webpages/Menu';
import Bonus from './Webpages/Bonus';
import Profile from './Webpages/Profile';
import Footprint from './Webpages/Footprint';
import Recipes from './Webpages/Recipes';
import Fridge from './Webpages/Fridge';
import Coaching from './Webpages/Coaching';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();



function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Bonus" component={Bonus} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Footprint" component={Footprint} options={{ headerShown: false }} />
        <Stack.Screen name="Recipes" component={Recipes} options={{ headerShown: false }} />
        <Stack.Screen name="Fridge" component={Fridge} options={{ headerShown: false }} />
        <Stack.Screen name="Coaching" component={Coaching} options={{ headerShown: false }} />


      </Stack.Navigator>
      <StatusBar hidden={false} style='auto'/>
    </NavigationContainer>

  );
}

export default App;