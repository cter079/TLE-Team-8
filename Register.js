import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';


const Stack = createStackNavigator();



export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const [isDisabled, setIsDisabled] = useState(true);



useEffect(() => {
    if (username.length > 0 && password.length > 0 && email.length > 0 && fullName.length > 0) {
        setIsDisabled(false);
    } else {
        setIsDisabled(true);
    }
}, [username, password, email, fullName]);



    const handleRegister = async () => {
      
        //if the password isnt more than 8 characters long
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        //allow only letters and numbers and dots in the email
        if (!email.match(/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)) {
            setError('Email must be valid');
            return;
        }
        
        //if the password doesnt contain special characters or numbers tell them to use them
        if (!password.match(/[!@#$%^&*(),.?":{}|<>]/g) || !password.match(/[0-9]/g)) {
            setError('Password must contain at least one special character and one number');
            return;
        }
        //if the username has weird characters tell them to use letters and numbers
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            setError('Username must contain only letters and numbers');
            return;
        }
        //if the username is less than 4 characters long tell them to use more
        if (username.length < 4) {
            setError('Username must be at least 4 characters long');
            return;
        }
        //if the username is more than 20 characters long tell them to use less
        if (username.length > 20) {
            setError('Username must be less than 20 characters long');
            return;
        }



        try {

            const response = await axios.post('https://expressjsbackend.herokuapp.com/api/register',

                { username, password, email, fullName },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            navigation.navigate('Home', { fullName: fullName });

        } catch (error) {
            setError('Username or email already exists');
        }
    };

    return (
        
        <View style={styles.container}>
       
            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Menu')}>
               <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>

            <Text style={styles.logo}>Sign up</Text>
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
          placeholder="E-mail..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          required
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Full Name..."
          placeholderTextColor="#003f5c"
         onChangeText={(text) => setFullName(text)}
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
            
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity  style={isDisabled? styles.loginBtnDisabled:styles.loginBtn} onPress={handleRegister} disabled={isDisabled}>
        <Text style={styles.loginText}>REGISTER</Text>
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
        right:100,
        },
        rememberMeLabel: {
        marginLeft: 10,
        },
        checkbox: {
        alignSelf: 'center',
        width: 18,
        height: 18,
    
        },
        
  loginBtn: {
    width: '100%',
    backgroundColor: '#52542b',
    borderRadius: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
    marginTop: 20,
    marginBottom: 10,


    },
    back: {
        position: 'absolute',
        top: 60,
        left: 10,

    },




});