import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert, Button, KeyboardAvoidingView, Platform, Keyboard, ImageBackground, Animated} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../firebase';
import Icon from 'react-native-vector-icons/Ionicons';







export default function Chat({ route }) {
    const { user } = route.params;
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [username2, setUsername2] = useState('');
  const messagesRef = db.collection('messages');
  const [messageOpacity, setMessageOpacity] = useState(new Animated.Value(0));



  useEffect(() => {
    const getCurrentUser = async () => {
        const currentUser = await AsyncStorage.getItem('username');
                    setUsername(currentUser);
                    setUsername2(user.username);
        }

        const getMessages = async () => {

    const unsubscribe = messagesRef
    .where('users', 'in', [[username, username2], [username2, username]])

      .orderBy('timestamp')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => doc.data());
        Animated.timing(messageOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        setMessages(messages);
        
      });

    return unsubscribe;
    };
    getCurrentUser();
    getMessages();





    
}, [username, username2]);

const sendMessage = async () => {
    await messagesRef.add({
      users: [username, username2],
      sender: username,
      text: newMessage,
      timestamp: new Date(),
    });
    setNewMessage('');
  };

  return (
    <View style={styles.container}>

    <View style={styles.chatScreen}>
   
            <View style={styles.chatHeader}>
            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Chats')}>
                <Icon name='arrow-back' size={25} color='white' />
            </TouchableOpacity>
            <Image
                style={{ width: 35, height: 35, borderRadius: 50, marginTop: 55, marginLeft: 10 }}
                source={{ uri: 'https://www.pngitem.com/pimgs/m/22-223968_default-profile-picture-circle-hd-png-download.png' }}
            />

      <Text style={styles.chatName}>{user.username}</Text>
        </View> 
      <View style={styles.chatmain}>
      <ScrollView>
        {messages.map((message) => (
          <View key={message.timestamp.toMillis()}>
           
            {message.sender === username ? (
                <View style={[styles.sent, styles.messageOpacity]}>
              <Text style={styles.sentText}>
                {message.text}
              </Text>
              <Text style={styles.sentTimeSent}>
                {message.timestamp.toDate().toLocaleTimeString()
                  .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}   
                </Text>
                </View>
            ) : (
                <View style={[styles.received, styles.messageOpacity]}>
              <Text style={styles.receivedText}>
                {message.text}
              </Text>
              <Text style={styles.sentTimeReceived}>
                {message.timestamp.toDate().toLocaleTimeString()
                  .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}   
                </Text>
                </View>
            )}
          </View>
        ))}
        </ScrollView>
      </View>
    </View>
    <View style={styles.inputContainer}>
        <TextInput value={newMessage} style={styles.textInput} onChangeText={setNewMessage} placeholder='Message' />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Icon name='send' style ={styles.sendIcon} size={25} color='white' />
        </TouchableOpacity>

      </View>
    </View>
  );





}

const styles = StyleSheet.create({
    chatScreen: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#1d252e',
        
    },
    container: {
        flex: 1,
       
    },
    image: {
        height: '100%',
        width: '100%',

    },
    chatmain: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    sent: {
        backgroundColor: '#575343',
        color: 'white',
        maxWidth: '70%',
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginTop:5,
        display: 'flex',
        flexDirection: 'row',

    },
    sentText: {
        color: 'white',
        fontSize: 15,
        padding: 10,

    },
    received: {
        backgroundColor: 'white',
        maxWidth: '70%',
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',

    },
    receivedText: {
        color: 'black',
        fontSize: 15,
        padding: 10,

    },
    sentTimeSent: {
        color: 'white',
        fontSize: 10,
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 5,
    },
    sentTimeReceived: {
        color: 'black',
        fontSize: 10,
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 5,
    },




    chatHeader: {
        width: '100%',
        height: 100,
        backgroundColor: '#273443',
        display: 'flex',
        flexDirection: 'row',

    },
    chatName: {
        fontSize: 20,
        color: 'white',
        marginTop: 58,
        marginLeft: 10,
        fontWeight: '500',

    },
    textInput: {
        height: 50,
        width: 300,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 40,
        paddingHorizontal: 20,
        },
    
        back: {
            marginLeft: 10,
            marginTop: 60,
        },
        inputContainer: {
            position: 'absolute',
            flexDirection: 'row',
            bottom: 20,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',

            
        },
        sendButton: {
            backgroundColor: '#575343',
            width: 50,
            height: 50,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
           
        },
        sendIcon: {
            color: 'white',
            transform: [{ rotate: '-20deg' }],

        },



});
