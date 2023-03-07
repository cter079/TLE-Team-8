import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Image, ScrollView,  Alert, ImageBackground} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Coaching() {
    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.imageBackground} blurRadius={10}>
        <View style={styles.mainContainer}>
         <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <View style={[styles.bonusButtonRow2,styles.shadowProp]} onPress={() => navigation.navigate('Coaching')}>
      <Image source={require('../assets/coaching.png')}  style={styles.bonusImageGroceries} />
        <Text style={styles.bonusText1}>Coaching</Text>
      </View>
      </View>
      </ImageBackground>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
       
    },
    mainContainer: {
      paddingHorizontal: 20,
    },
    imageBackground : {
        flex: 1,
        width: '100%',
        height: '100%',

    },
    bonusImageGroceries : {
      position: 'absolute',
      width: '80%',
      height: '100%',
      resizeMode: 'contain',
      bottom: 0,
      left: 0,
    
    },
    back: {
        position: 'absolute',
        top: 60,
        left: 10,
        zIndex: 1,
    },
    bonusButtonRow2: {
      width: '100%',
      backgroundColor: '#616340',
      borderRadius: 15,
      height: 130,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      marginTop: 120,
      overflow: 'hidden',
    },
    bonusText1: {
      color: 'white',
      fontSize: 30,
      fontFamily: 'Vietnam',
      textAlign: 'center',
      zIndex: 1,
    },
      
});
