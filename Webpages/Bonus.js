import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Image, ScrollView, ImageBackground, Animated} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { parse } from 'html-parse-stringify2';







export default function Bonus() {
  const navigation = useNavigation();
  const [bonusOffers, setBonusOffers] = useState([]);
  const [loading , setLoading] = useState(true);
  const [bonusStyle, setBonusStyle] = useState(styles.bonusButton);
  const [bonusCard , setBonusCard] = useState(styles.bonusCardInvisible);
  

  const [pressed , setPressed] = useState(false);

  
    useEffect(() => {
        axios.get('https://expressjsbackend.herokuapp.com/api/scrape',
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        .then((response) => {
            setBonusOffers(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const changeStyle = () => {
      setPressed(!pressed);
    }

    useEffect(() => {
      if (pressed) {
        setBonusStyle(styles.bonusButton2);
        setBonusCard(styles.bonusCardVisible);
      } else {
        setBonusStyle(styles.bonusButton);
        setBonusCard(styles.bonusCardInvisible);
      }
    }, [pressed]);





  







  return (
    <View style={styles.container}>
            <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.imageBackground} blurRadius={10}>
<View style={styles.mainContainer}>
    <TouchableOpacity style={[bonusStyle,styles.shadowProp]} onPress={changeStyle}>
      <Image source={require('../assets/ah.png')}  style={styles.bonusImageAH} />

        <Text style={styles.bonusText1}>Bonus</Text>
   
      </TouchableOpacity>
      <TouchableOpacity style={[bonusCard,styles.shadowProp]} onPress={changeStyle}>
      <Image source={
        require ('../assets/bonuskaart.png')
      }  style={styles.bonusCardImage} />
      </TouchableOpacity>
    <Text style={loading ? styles.logo : styles.none}>Albert Heijn bonusdata ophalen... dit kan een minuut duren. Verlaat de pagina niet</Text>
     <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Home')}>
               <Icon name="arrow-back" size={30} color="#424423" />
            </TouchableOpacity>
        <ScrollView>

        <View style={styles.bonus}>

        {bonusOffers.map((bonusOffer) => (
            <View style={styles.inputView} key={bonusOffer.imageSrc}>
            <Image style={styles.image} source={{uri: bonusOffer.imageSrc}} />
            <View style={styles.inputPriceContainer}>
            <Text style={styles.inputPrice}>{bonusOffer.price}</Text>
            <Text style={styles.inputPrice2}>{bonusOffer.price2}</Text>
            </View>

            <Text style={styles.inputText}>{bonusOffer.title}</Text>

            </View>
        



        ))}
        </View>

        </ScrollView>
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
    paddingHorizontal: 10,
  },
  bonusButton: {
    width: '100%',
    backgroundColor: '#7c804b',
    borderRadius: 15,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 100,
    overflow: 'hidden',
  },
  bonusButton2: {
    display: 'none',
  },
  bonusCardInvisible: {
    display: 'none',
  },
  bonusCardVisible: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    height: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 100,
    overflow: 'hidden',
  },
  bonusCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 1,
  },

  bonusText1: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Vietnam',
    textAlign: 'center',
    zIndex: 1,
  },
  back: {
    position: 'absolute',
    top: 60,
    left: 10,
    zIndex:1,
},
imageBackground: {
  flex: 1,
  width: '100%',

},
none : {
    display: 'none',
},
bonusImageAH : {
  position: 'absolute',
  width: '80%',
  height: '100%',
  top: 0,
  left: -80,

},


    logo: {
    fontSize:20,
    width: '100%',
    paddingHorizontal: 20,
    color:"#000",
    textAlign: 'center',
    marginTop: 30,
    },
    inputPriceContainer :{
        fontWeight:"bold",
        position: 'absolute',
        fontSize: 25,
        top: 5,
        left: 20,
        zIndex:1,
        color: '#fc7703',
        display: 'flex',
        flexDirection: 'row',

    },
    inputPrice :{
        fontWeight:"bold",
        fontSize: 25,
        zIndex:1,
        color: '#fc7703',
    },
    inputPrice2 :{
        fontWeight:"bold",
        fontSize: 20,

        zIndex:1,
        color: '#fc7703',
    },
    
image : {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
},
bonus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
  },
  inputView: {
    width: "49%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    height: 230,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    },
    bonusImg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        
      },
    inputText: {
        maxHeight: 100,
        width: 150,
        color: "black",
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
      
        },



    





});

  
