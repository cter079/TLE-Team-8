import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';




export default function Menu() {
    const navigation = useNavigation();


    const image = { uri: "https://media.istockphoto.com/id/1322376077/photo/abstract-white-studio-background-for-product-presentation-empty-room-with-shadows-of-window.jpg?b=1&s=170667a&w=0&k=20&c=2DGqZyJU9ZRa56pXrQjCG3pMUYggeaT18LArhM-lbJ4=" };
    const [fontsLoaded] = useFonts({
        'Caveat': require('../assets/Caveat-VariableFont_wght.ttf'),
        'Vietnam': require('../assets/BeVietnamPro-Light.ttf'),
        'VietnamBold': require('../assets/BeVietnamPro-SemiBold.ttf'),
      });

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.image} blurRadius={10}>
                <Image source={require('../assets/menu-icon.png')} style={{ width: 150, height: 150, bottom: 100, borderRadius:25, }} />
                <Text style={{ color: '#52542b', fontSize: 30, bottom: 100, fontFamily: 'Vietnam' }}>Sustainable Home</Text>
                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>Sign up</Text>
                </TouchableOpacity>
            </ImageBackground>

        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: '100%',
        alignItems: 'center',

    },


  

    loginBtn: {
        width: '50%',
        backgroundColor: '#52542b',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        top: 225,
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    registerBtn: {
        width: '50%',
        backgroundColor: 'white',
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        top: 225,
    },
    registerText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
    },

});