import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import db from '../firebase';





export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [isDisabled, setIsDisabled] = useState(true);


    useEffect(() => {

      //if token is stored in async storage, navigate to home screen
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.navigate('Home');
        }
      };
      checkToken();
        if (username.length > 0 && password.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [username, password]);






  const handleLogin = async () => {

    if (!username || !password) {
      setError('Please enter your username and password');
      return;
    } 


  
    try {
      const response = await axios.post('https://expressjsbackend.herokuapp.com/api/login', 
    
      { username, password },
       {
        headers: {
          'Content-Type': 'application/json'
        }});
      const { token, fullName:fullName, email } = response.data;
      console.log(response.data);

      if (rememberMe) {
        // Store the token and username in async storage
        await AsyncStorage.multiSet([
          ['token', token],
          ['loggedInUser', fullName],
          ['username', username],
          ['email', email],

        ]);
      }
      await AsyncStorage.multiSet([
        ['loggedInUser', fullName],
        ['username', username],
        ['email', email],
      ]);
  
      // Redirect to home screen with the username
        navigation.navigate('Home', { fullName: fullName });



  
    } catch (error) {
        setError('Invalid username or password');
        }
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Menu')}>
               <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
      <Text style={styles.logo}>Log in</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
          required
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          autoCapitalize="none"
          required
        />
      </View>

      <View style={styles.rememberMeContainer}>
      <Checkbox value={rememberMe} onValueChange={setRememberMe}  style={styles.checkbox}/>
        <Text style={styles.rememberMeLabel}>Remember Me</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity  style={isDisabled? styles.loginBtnDisabled:styles.loginBtn} onPress={handleLogin} disabled={isDisabled}>
        <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
   
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
   
    padding: 40,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 20,
    color: '#000000',
    textAlign:'left',
  },
  inputView: {
    width: '100%',
    backgroundColor: '#edf5f7',
    borderRadius: 10,
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 15,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
    rememberMeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    },
    rememberMeLabel: {
    marginLeft: 10,
    },
    checkbox: {
    alignSelf: 'center',
    width: 18,
    height: 18,
    borderWidth: 0.5,
    borderRadius: 4,

    },




  
  loginBtn: {
    width: '100%',
    backgroundColor: '#52542b',
    borderRadius: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
    error: {
    color: 'red',
    marginBottom: 20,
    },
    link: {
    color: 'blue',
    },
    loginBtnDisabled: {
    width: '100%',
    backgroundColor: '#a0a35f',
    borderRadius: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,


    },
    back: {
        position: 'absolute',
        top: 60,
        left: 10,

    },
    

});