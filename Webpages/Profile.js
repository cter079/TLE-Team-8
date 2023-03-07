import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Image, ScrollView, Button, ImageBackground } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';



export default function Profile() {
    //get the fullname from asyncstorage
    const [fullName, setFullName] = React.useState('Loading...');
    const [username, setUsername] = React.useState('Loading...');
    const [email, setEmail] = React.useState('Loading...');
    const [password, setPassword] = React.useState('Loading...');
    const [image, setImage] = React.useState(null);
    const [badge1, setBadge1] = React.useState(false);
    const [badge2, setBadge2] = React.useState(false);
    const navigation = useNavigation();

    
    

    React.useEffect(() => {
        const getFullName = async () => {
            setFullName(await AsyncStorage.getItem('loggedInUser'));
        };
        const getUserName = async () => {
            setUsername(await AsyncStorage.getItem('username'));
        };

        const getImage = async () => {
            const imageStorage = await AsyncStorage.getItem('image');
if(imageStorage !== null){
    setImage(imageStorage);
    } else {
        setImage('https://www.pngitem.com/pimgs/m/22-223968_default-profile-picture-circle-hd-png-download.png');
        }
                   
        };


        
        // if (imageStorage._A !== null ) {
        //     setImage(imageStorage);
        // } else {
        //     setImage('https://www.pngitem.com/pimgs/m/22-223968_default-profile-picture-circle-hd-png-download.png');
        // }
        getUserName();
        getFullName();
        getImage();
        getProfileData();

    }

        , [username]);




const getProfileData = async () => {
        axios.get(`https://expressjsbackend.herokuapp.com/api/profile?username=${username}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                setEmail(res.data.user.email);
            })
            .catch((error) => {
                console.log(error);
            });

            //get badges from database
            axios.get(`https://expressjsbackend.herokuapp.com/api/badges?username=${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((res) => {

                    if(res.data.rows2[0]){
                        setBadge1(true);
                    }
                    if(res.data.rows2[1]){
                        setBadge2(true);
                    }
                   
                   
                }
                )
                .catch((error) => {
                    console.log(error);
                }
                );
    };


    const pickImage = async () => {

        ImagePicker.getMediaLibraryPermissionsAsync()



        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
            quality: 0.5,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await AsyncStorage.setItem('image', result.assets[0].uri);
        }


    };


    const logout = async () => {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('loggedInUser');
        await AsyncStorage.removeItem('token');

        navigation.navigate('Menu');
    }






    return (
        <View style={styles.container}>
             <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.imageBackground} blurRadius={10}>

        <View style={styles.mainContainer}>
            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <View style={styles.footer}>
            <Image source={require('../assets/profile-icon.png')} style={styles.profileIcon} />
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.rows}>
                    <View>
                        <Text
                            style={styles.text_footer}
                        >{fullName}
                        </Text>
                    </View>
                    <View >
                        <Text
                            style={styles.textInput}
                        >{username}</Text>
                    </View>
                    <View >
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput2}
                            autoCapitalize="none"
                            value={email}
                        />
                    </View>

                </View>
            </View>
        
                <View style={styles.badges}>
                <Image source={require('../assets/trophy.png')} style={styles.profileIcon} />
                    <Text style={styles.badgeText}>Badges</Text>
                    <View style={styles.badgeContainer}>
                    {badge1 ? (
                        <View style={styles.badge}>
                        <View style={styles.badgeImageContainer}>

                            <Image
                                source={ require(`../assets/leaf1.png`) }
                                style={styles.badgeImage}
                            />
                            </View>
                            <Text style={styles.badgeDesc}>Goed begin!</Text>
                        </View>
                    ) : (<Text style={styles.error1}>Je hebt nog geen badges verzameld.</Text>)}



                    {badge2 ?( 
                            <View style={styles.badge}>
                            <View style={styles.badgeImageContainer}>
                                <Image
                                    source={ require(`../assets/leaf.png`) }
                                    style={styles.badgeImage}
                                />
                                </View>
                                <Text style={styles.badgeDesc}>Week op weg!</Text>
                            </View>


                ): (null)}
                </View>

                </View>

            
            <TouchableOpacity style={styles.action}>
                    <TouchableOpacity
                        style={styles.frontForm} >
                        <Icon name='help-circle-outline' size={30} color='white' />
                    </TouchableOpacity>
                    <Text style={styles.red}>FAQ</Text>
                    <TouchableOpacity
                        style={styles.backForm2} >
                        <Icon name='chevron-forward-outline' size={30} color='white' />
                    </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={logout}>
                    <TouchableOpacity
                        style={styles.frontForm} >
                        <Icon name='exit-outline' size={30} color='white' />
                    </TouchableOpacity>
                    <Text style={styles.red}>Log uit</Text>
                    <TouchableOpacity
                        style={styles.backForm} >
                        <Icon name='chevron-forward-outline' size={30} color='white' onPress={logout} />
                    </TouchableOpacity>
                </TouchableOpacity>



</View>
</ImageBackground>
            </View>



            )


}

            const styles = StyleSheet.create({
                container: {
                flex: 1,
            



    },
            mainContainer: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            paddingHorizontal: 10,
            },
            imageContainer: {
                width: 100,
            height: 100,
            borderRadius: 60,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 15,
    },
    imageBackground: {
        flex: 1,
        width: '100%',
    
    },
    profileIcon :{
        position: 'absolute',
        width: 100,
        height: 100,
        right: 0,
        bottom: -20,
        opacity: 0.5,
    },
    textInput: {
        color: '#424423',
        fontFamily: 'Vietnam',
    },
    textInput2: {
        color: '#424423',
        fontFamily: 'Vietnam',

    },

            frontForm :{
                marginLeft: 10,


    },
    error1:{
        marginTop: 20,
        textAlign: 'center',
        

    },
            backForm :{
                position: 'relative',
            marginLeft: '65%',
    },
            backForm2 :{
                position: 'relative',
            marginLeft: '70%',
    },

            red : {
                marginLeft: 10,
            color: 'white',
            fontFamily: 'Vietnam',
        
    },

            back: {
                position: 'absolute',
            top: 60,
            left: 10,
            zIndex: 1,
    },
            footer: {
                backgroundColor: '#8f9164',
            width: '100%',
            borderRadius: 30,
            marginTop: 120,
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
        


    },

    badges : {
        width: '100%',
        height: 120,
        backgroundColor: '#7c804b',
        borderRadius: 25,
        marginTop: 10,
        paddingHorizontal: 20,
        overflow: 'hidden',


    },
    badgeContainer : {
        display: 'flex',
        flexDirection: 'row',
        
    },
    badge : {
        width: 70,
        height: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        

    },
    badgeText : {
        color: '#3c3d2f',
        fontSize: 16,
        fontFamily: 'VietnamBold',
        textAlign: 'center',
    },

    badgeImageContainer : {
        backgroundColor: '#5f6144',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',


    },
    badgeImage : {
        width: 65,
        height: 65,
    },
    badgeDesc : {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Vietnam',
        color: '#fff',
        textAlign: 'center',

    },


            action: {
                flexDirection: 'row',
            marginTop: 10,
            backgroundColor: '#58593c',
            borderRadius: 15,
            width: '100%',
            height: 50,
            alignItems: 'center',
            textAlign: 'center',
    },




            text_footer: {
                color: '#424423',
            fontSize: 18,
            fontFamily: 'VietnamBold',
            marginTop: 30,

    },
    rows: {
                display: 'flex',
            flexDirection: 'column',
            marginLeft: 25,
    },
            


            image: {
                width: 100,
            height: 100,
    },


});
