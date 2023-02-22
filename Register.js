import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';





export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();



 
;


  const handleRegister = async () => {
    if(password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }
  
    try {
        

      const response = await axios.post('http://192.168.68.111:8000/api/register', 
    
      { username, password },
       {
        headers: {
          'Content-Type': 'application/json'
        }});
    
      // Redirect to home screen with the username
        navigation.navigate('Home', { username: username });
  
    } catch (error) {
        setError('Username already exists');
        }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Register</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
        <View style={styles.inputView}> 
        <TextInput
            style={styles.inputText}
            placeholder="Confirm Password..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={true}
            autoCapitalize="none"
            required
            />
        </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
        <Text style={styles.loginText}>REGISTER</Text>
      </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
        >
            <Text style={styles.loginText}>Already have an account?</Text>
        </TouchableOpacity>

    </View>

   

  );
}

const styles = StyleSheet.create({
   
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#005c66',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },

  loginBtn: {
    width: '80%',
    backgroundColor: 'red',
    borderRadius: 25,
    height: 50,
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
        marginBottom: 10,
    },

});