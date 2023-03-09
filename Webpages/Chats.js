import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert, Button, KeyboardAvoidingView, Platform, Keyboard, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import db from '../firebase';
import geoFirestore from '../firebase';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { GeoPoint } from 'firebase/firestore';
import { GeoFirestore } from 'geofirestore';
import Chat from './Chat';


export default function Chats() {
    const navigation = useNavigation();
    const [location, setLocation] = React.useState(null);
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [message , setMessage] = useState('');





    useEffect(() => {

        const getCurrentUser = async () => {
            const currentUser = await AsyncStorage.getItem('username');
            setUsername(currentUser);
        }


        const getLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        };




        const setLocationData = async () => {
            if (!location) {

                let locationData = await Location.getCurrentPositionAsync({});
                setLocation(locationData);
            }
        };
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }

        const getUsers = async () => {
            if (location) {
                const { latitude, longitude } = location.coords;

                const usersRef = db.collection('users');

                // Find all users within 10km of the current location
                const querySnapshot = await usersRef.get();
                const users = querySnapshot.docs.filter((doc) => {
                    const user = doc.data();
                    const userLocation = user.location;
                    const distanceInKm = calculateDistance(latitude, longitude, userLocation.latitude, userLocation.longitude);
                    return distanceInKm <= 1;
                }).map((doc) => doc.data());


                setUsers(users);
                return users;

            }
            //get most recent message from each user
    
            

        };
        

        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceInKm = R * c;

            return distanceInKm;
        }
        getCurrentUser();
        getLocationPermission();
        setLocationData();
        getUsers();
    }, [location]);

    useEffect(() => {
        const getMessages = async () => {
            
            //for each user, get the most recent message
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const messagesRef = db.collection('messages');
                const querySnapshot = await messagesRef.where('users', 'in', [[username, user.username], [user.username, username]]).orderBy('timestamp', 'desc').limit(1).get();
                const messages = querySnapshot.docs.map((doc) => doc.data());
                const message = messages[0];
                setMessage(message.text);
               


            }

            };
            getMessages();
    }, [users]);

    return (
        <View style={styles.container}>

                <View style={styles.chatScreen}>

                    <View style={styles.chatHeader}>
                        <TouchableOpacity
                            style={styles.back}
                            onPress={() => navigation.navigate('Home')}>
                            <Icon name='arrow-back' size={25} color='white' />
                        </TouchableOpacity>
        

                        <Text style={styles.chatTitle}>Buurtchat</Text>
                    </View>
                    <View style={styles.chatmain}>
                        <Text style={styles.chatmainText}>Chats</Text>
                    </View>
                    <View style={styles.chatBody}>
                    {users.map((user) => (
            user.username !== username && (
            <TouchableOpacity
              key={user.username}
              onPress={() => navigation.navigate('Chat', { user })}
              style={styles.chat}
            >
            <Image
                style={{ width: 50, height: 50, borderRadius: 50}}
                source={{ uri: 'https://www.pngitem.com/pimgs/m/22-223968_default-profile-picture-circle-hd-png-download.png' }}
            />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{user.username}</Text>
              <Text style={styles.chatText}>{message}</Text>
            </View>

            </TouchableOpacity>
            )
            
          ))}
                    </View>
                </View>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7f945c',
        alignItems: 'center',
        justifyContent: 'center',
    },
   
    chatScreen: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#1d252e',
    },
    container: {
        flex: 1,
       
    },
    image: {
        height: '100%',
        width: '100%',

    },
   
    
    chatHeader: {
        width: '100%',
        height: 100,
        backgroundColor: '#273443',
        display: 'flex',
        flexDirection: 'row',



    },
    chatTitle: {
        fontSize: 20,
        color: 'white',
        marginTop: 60,
        fontWeight: '500',
        marginLeft: 30,


    },
    back: {
        left: 10,
        marginTop: 60,
    },
    chatmain: {
        width: '100%',
        backgroundColor: '#273443',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    chatmainText: {
        fontSize: 15,
        color: 'white',
        marginTop: 30,
        paddingHorizontal: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 5,
        


        

    },
    chatBody: {
        width: '100%',
        height: '100%',
    },
    chat : {
        width: '100%',
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,

    },

    chatName: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        marginLeft: 20,


    },
    chatText: {
        fontSize: 15,
        color: '#9fa0a1',
        marginLeft: 20,
        
    },



});









