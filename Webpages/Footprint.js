import React, { useState, useEffect } from 'react';
import { AppRegistry, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';



import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Footprint() {
    const [showForm, setShowForm] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [username, setUsername] = useState('Loading...');
    const [percentage, setPercentage] = useState(null);
    const [summary, setSummary] = useState('');
    const navigation = useNavigation();
    const [color, setColor] = useState('#424423');
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [timestamp, setTimestamp] = useState(null);
    const [footprints, setFootprints] = useState([]);
    const notificationListener = useRef();
    const responseListener = useRef();



    useEffect(() => {

        const checkFormSubmission = async () => {
            // AsyncStorage.removeItem('formTimestamp');

            const timestamp = await AsyncStorage.getItem('formTimestamp');
            setTimestamp(timestamp);
            if (timestamp != null) {
                const lastSubmission = new Date(parseInt(timestamp));
                const now = new Date();
                const hoursSinceSubmission = (now - lastSubmission) / 1000 / 60 / 60;
                if (hoursSinceSubmission < 24) {
                    setFormSubmitted(true);
                } else {
                    setShowForm(true);
                }
            } else {
                setShowForm(true);


            }
        };

        const getUsername = async () => {
            const username = await AsyncStorage.getItem('username');
            setUsername(username);
        };

        getUsername();
        checkFormSubmission();
        getFootprints();



    }, [timestamp]);


    const getFootprints = async () => {
        if (username != 'Loading...') {

            axios.get(`https://expressjsbackend.herokuapp.com/api/footprint?username=${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((res) => {
                    const footprint = []
                    for (let i = 0; i < res.data.data.length; i++) {
                        if (i < 7) {
                            footprint.push(res.data.data[i]);
                        }


                    }
                    const userWastedData7 = res.data.data.slice(0, 7).map((data) => data.wasted);

                    if (userWastedData7.length < 7) {
                        console.log('Not enough data to award badge');
                    } else {
                        const userWastedData7Numbers = userWastedData7.map((data) => parseInt(data));
                        let userWastedAverage7 = 0;

                        for (let i = 0; i < userWastedData7Numbers.length; i++) {
                            userWastedAverage7 += userWastedData7Numbers[i];

                        }
                        userWastedAverage7 = userWastedAverage7 / userWastedData7Numbers.length;

                        const shouldAwardBadge = userWastedAverage7 < 94.3;


                        if (shouldAwardBadge) {

                            axios.post(`https://expressjsbackend.herokuapp.com/api/badges`, {
                                username: username,
                                badge: 'Week op weg!',
                                image: '../assets/leaf.png',

                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then((res) => {
                                    console.log('Badge awarded!');
                                    Alert.alert('Badge vrijgespeeld!', 'Je hebt een badge verdiend! Ga naar je profiel om hem te zien.');
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    }


                    //do it for 1 day
                    const userWastedData1 = res.data.data.slice(0, 1).map((data) => data.wasted);
                    const userWastedAverage1 = userWastedData1.reduce((total, num) => total + num, 0) / userWastedData1.length;
                    const shouldAwardBadge1 = userWastedAverage1 < 94.3;

                    // Add badge to user's profile
                    if (shouldAwardBadge1) {
                        axios.post(`https://expressjsbackend.herokuapp.com/api/badges`, {
                            username: username,
                            badge: 'Goed begin!',
                            image: '../assets/leaf1.png',

                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((res) => {
                                console.log('Badge awarded!');
                                Alert.alert('Badge vrijgespeeld!', 'Je hebt een badge verdiend! Ga naar je profiel om hem te zien.');
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }

                    setFootprints(footprint);
                    const mostRecentFootprint = res.data.data[0].wasted;
                    let percentageCalculation = (mostRecentFootprint / 94.3) * 100;
                    if (percentageCalculation > 100) {
                        setColor('red');
                        percentageCalculation -= 100;
                        setSummary(`Je hebt ${percentageCalculation.toFixed(0)}% meer voedsel verspild vandaag dan het Nederlands gemiddelde.`);
                    }
                    else {
                        setSummary(`Je hebt ${100 - percentageCalculation.toFixed(0)}% minder voedsel verspild vandaag dan het Nederlands gemiddelde.`);
                    }
                    setPercentage(percentageCalculation.toFixed(0));



                })
                .catch((error) => {
                    console.log(error);
                });





        }
    };


    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    async function sendPushNotification(expoPushToken) {
        await Notifications.scheduleNotificationAsync({
            content: {
                to: expoPushToken,
                sound: 'default',
                title: 'Ecologische voetafdruk',
                body: 'Uw dagelijkse formulier staat klaar!',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 86400 },
        });
    }

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const handleInputChange = (name, value) => {
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };
    const handleSubmit = async () => {

        formValues.name = formValues.name.replace(',', '.');
        if (formValues.name == '') {
            alert('Please fill in a number');
            return;
        }
        await AsyncStorage.setItem('formTimestamp', Date.now().toString());
        setFormSubmitted(true);
        setShowForm(false);
        getFootprints();
        sendPushNotification(expoPushToken);
        const response = await axios.post('https://expressjsbackend.herokuapp.com/api/footprint', {

            amount: formValues.name,
            username: username,
            date: new Date()
            ,
            Headers: {
                'Content-Type': 'application/json',
            }
        });


    };


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.image}>

                <View style={styles.mainContainer}>
                    <TouchableOpacity
                        style={styles.back}
                        onPress={() => navigation.navigate('Home')}>
                        <Icon name="arrow-back" size={30} color="#424423" />
                    </TouchableOpacity>

                    {showForm ? (
                        <View style={styles.form}>
                            <Text style={styles.question}>Hoeveel gram voedsel heb jij vandaag verspild?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Hoeveelheid e.g. 20, 34, 47.5"
                                onChangeText={(text) => handleInputChange('name', text)}
                            />
                            <TouchableOpacity style={styles.submit} onPress={handleSubmit}><View><Text style={styles.buttonText}>Submit</Text></View></TouchableOpacity>
                        </View>
                    ) : null}

                    {formSubmitted && (
                        <View style={styles.footprintcontainer}>
                            <View style={styles.summarycontainer}>
                                <Image source={require('../assets/summary.png')} style={styles.summaryImage} />

                                <View style={styles.circleContainer}>
                                {/* <Text style={styles.percentage}>{percentage}%</Text> */}

                                    <Progress.Circle style={styles.circle}  size={150} animated={true} progress={percentage / 100} borderWidth={0} showsText={true} color={color} thickness={9} />
                                </View>
                                <View style={styles.summaryTextContainer}>
                                    <Text style={styles.summarytitle}>Dagelijks overzicht</Text>
                                    <Text style={styles.summarytext}>{summary}</Text>
                                </View>

                            </View>
                            <View style={styles.awarenesscontainer}>
                                <Image source={require('../assets/waste.png')} style={styles.bonusImg} />
                                <View style={styles.awarenessTextContainer}>
                                    <Text style={styles.awarenesstitle}>Hoeveel voedsel verspillen we?</Text>
                                    <Text style={styles.awarenessdescription}>In Nederland wordt jaarlijks 2 miljard kilo voedsel verspild (1,5 - 2,4 miljoen ton) (bron: Monitor Voedselverspilling Update 2019). Ofwel een file van Utrecht naar Barcelona met bumper aan bumper rijdende vrachtwagens gevuld met voedsel. Dat gebeurt in de hele keten: van boer tot bord en van lopende band tot restaurant.</Text>
                                </View>
                            </View>

                            <View style={styles.historycontainer}>
                                <Image source={require('../assets/history.png')} style={styles.historyImage} />
                                <Text style={styles.historytitle}>Eerder</Text>
                                <ScrollView>


                                    {footprints.map((footprint) => (
                                        <View style={styles.historyitem} key={footprint.date}>
                                            <Progress.Circle style={styles.historycircle} size={30} animated={true} progress={1} borderWidth={0} color={footprint.wasted > 94.3 ? 'red' : '#7c804b'} thickness={15} />
                                            <Text style={styles.date}>{
                                                footprint.date.substring(8, 10) + '-' + footprint.date.substring(5, 7) + '-' + footprint.date.substring(0, 4)
                                            }</Text>
                                            <Text style={styles.wasted}>{footprint.wasted} gram</Text>

                                        </View>
                                    ))}





                                </ScrollView>
                            </View>

                        </View>

                    )}
                </View>
            </ImageBackground>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
    },
    mainContainer: {
        paddingHorizontal: 10,
    },
    image: {
        flex: 1,
    },
    back: {
        position: 'absolute',
        top: 60,
        left: 10,
        zIndex: 1,
    },
    form: {
        width: '100%',
        marginTop: 275,
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',

    },
    summaryImage: {
        position: 'absolute',
        left: -50,
        bottom: -40,
        height: 220,
        opacity: 0.3,
        resizeMode: 'contain',

    },
    historyImage: {
        position: 'absolute',
        left: -180,
        bottom: -40,
        height: 280,
        opacity: 0.5,
        resizeMode: 'contain',

    },

    question: {
        fontSize: 20,
        textAlign: 'center',
        width: '80%',
        fontFamily: 'Vietnam',
    },
    bonusImg: {
        width: '40%',
        height: '100%',
        resizeMode: 'contain',
    },

    submit: {
        backgroundColor: '#424423',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'VietnamBold',
    },

    historycontainer: {
        width: '100%',
        height: 300,
        marginTop: 10,
        backgroundColor: '#424423',
        borderRadius: 25,
        opacity: 0.95,
        overflow: 'hidden',

    },
    awarenesscontainer: {
        width: '100%',
        backgroundColor: '#616340',
        borderRadius: 25,
        height: 200,
        marginTop: 10,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        opacity: 0.95,


    },

    awarenessTextContainer: {
        width: '55%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',


    },

    awarenesstitle: {
        fontSize: 14.5,
        textAlign: 'center',
        fontFamily: 'VietnamBold',
        color: '#94965f',
    },
    awarenessdescription: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Vietnam',
        color: 'white',

    },
    historyitem: {
        width: '100%',
        borderRadius: 25,
        height: 50,
        marginTop: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,

    },
    historycircle: {
        marginLeft: 10,
    },
    date: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Vietnam',
        marginLeft: 25,
        color: 'white',
    },
    wasted: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },

    circleContainer : {
        display: 'flex',
justifyContent: 'center',
alignItems: 'center',   
width: '45%', 
height: '100%',
alignSelf: 'center',

    
    },

    percentage: {
        fontSize: 30,
        position: 'absolute',
        textAlign: 'center',
        fontFamily: 'Vietnam',
        color: '#424423',
    },




    input: {
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 25,
        padding: 10,
        marginVertical: 10,
        width: '80%',
    },
    summarycontainer: {
        width: '100%',
        backgroundColor: '#7c804b',
        borderRadius: 25,
        height: '23%',
        justifyContent: 'center',
        marginTop: 120,
        display: 'flex',
        flexDirection: 'row',
        opacity: 0.95,
        overflow: 'hidden',

    },
    summarytitle: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'VietnamBold',
        color: '#424423',
    },

    summaryTextContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
   
   

    historytitle: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'VietnamBold',
        color: 'white',
        marginBottom: 20,
    },
    summarytext: {
        fontSize: 15,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Vietnam',

    },

});





