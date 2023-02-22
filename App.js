import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login  from './Login';
import Home from './Home';
import Register from './Register';

const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;