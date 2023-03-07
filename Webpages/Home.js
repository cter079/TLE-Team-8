import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Image, ImageBackground, TouchableHighlight} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';




import { Permission } from 'react-native';




export default function HomeScreen({ route }) {
  //get the fullname from asyncstorage 
  const [fullName, setFullName] = React.useState('Loading...');
  
  const imageBackground = { uri: "https://media.istockphoto.com/id/1322376077/photo/abstract-white-studio-background-for-product-presentation-empty-room-with-shadows-of-window.jpg?b=1&s=170667a&w=0&k=20&c=2DGqZyJU9ZRa56pXrQjCG3pMUYggeaT18LArhM-lbJ4=" };


 




  const firstName = fullName.split(' ')[0];
  const [weather, setWeather] = React.useState('Loading...');
  const [weatherDescription, setWeatherDescription] = React.useState('Loading...');
  const [city, setCity] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    const getFullName = async () => {
      const fullName = await AsyncStorage.getItem('loggedInUser');
      setFullName(fullName);
    };
    getFullName();
  }, []);
  




  useEffect(() => {
    const getNotificationPermission = async () =>{
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
    } else {
        alert('Must use physical device for Push Notifications');
    }
    }
    getNotificationPermission();
    
  }, []);


 


useEffect(() => {
  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }  
  };

  const setLocationData = async () => {
    if(!location){

    let locationData = await Location.getCurrentPositionAsync({});
    setLocation(locationData);
    }
  };

  const getWeather = async () => {
    if (location) {
      const city = await AsyncStorage.getItem('city');
      if(city === null){
        if(weather === 'Loading...'){
      const { latitude, longitude } = location.coords;
      axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
  params: {
    lat: latitude,
    lon: longitude,
    appid: '855642dc4b70cd088afae09f13689a61',
    units:'metric'
  }

})
      .then(response => {
        const { main: { temp }, weather: [{ description }] } = response.data;
        const { name } = response.data;
        console.log(response.data);

        setWeather(`${temp.toFixed(0)}°C`);
        //if the word Gemeente is in the name of the city, remove it
        if(name.includes('Gemeente')){
          setCity(name.replace('Gemeente ', ''));
        }else{

        setCity(name);
        AsyncStorage.setItem('city', name);
        }
        setWeatherDescription(description);
      })
      .catch(error => {
        console.log(error);
      });
    }

    } else {
      console.log('No location');
    }

    
    }
  };
  getLocationPermission();
  setLocationData();
  getWeather();

}, [location]);

  





  useEffect(() => {
    if (weatherDescription) {
      if (weatherDescription.includes('rain')) {
        setImage(require('../assets/rain.png'));
      } else if (weatherDescription.includes('cloud')) {
        setImage(require('../assets/Cloud.png'));
      } else if (weatherDescription.includes('clear')) {
        setImage(require('../assets/sun-icon.png'));
      }  else if (weatherDescription.includes('thunder')) {
        setImage(require('../assets/thunderstorm.png'));
      }
      if (weatherDescription === 'clear sky') {
        setImage(require('../assets/sun-icon.png'));
    
      } else if (weatherDescription === 'few clouds') {
        setImage(require('../assets/Cloud.png'));
      } else if (weatherDescription === 'scattered clouds') {
        setImage(require('../assets/Cloud.png'));
      } else if (weatherDescription === 'broken clouds') {
        setImage(require('../assets/Cloud.png'));
      } else if (weatherDescription === 'shower rain') {
        setImage( require('../assets/rain.png'));
      } else if (weatherDescription === 'rain') {
        setImage( require('../assets/rain.png'));
      } else if (weatherDescription === 'thunderstorm') {
        setImage( require('../assets/thunderstorm.png'));
      } 
       else if (weatherDescription === 'mist') {
        setImage(require('../assets/Cloud.png'));
      } 
       else {
        setImage(require('../assets/sun-icon.png'));
      }

    }
  }, [weatherDescription]);


  return (
    <View style={styles.container}>
        <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.image}>

   <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Profile')}>
                <Icon name='person-circle-outline' size={30} color='#424423' />
            </TouchableOpacity>
      <View style={styles.buttons}>
      <View style={styles.bigButtonWeather}>
      <Text style={styles.bonusTextWeatherTitle}>Home</Text>
      <View style={styles.weatherContainer}>
      <Image source={image} style={styles.weatherImg} />
        <Text style={styles.bonusTextWeatherMedium}>{weather}</Text>
        <View style={styles.weatherDescription}>
        <Text style={styles.bonusTextWeatherSmall}>{weatherDescription}</Text>
        <Text style={styles.bonusTextWeatherSmall}>{city}</Text>
        </View>

        </View>



      </View>
      <TouchableOpacity style={[styles.bonusButton,styles.shadowProp]} onPress={() => navigation.navigate('Bonus')}>
      <Image source={require('../assets/ah.png')}  style={styles.bonusImageAH} />

        <Text style={styles.bonusText1}>Bonus</Text>
   
      </TouchableOpacity>

      
<TouchableOpacity style={[styles.bonusButton,styles.shadowProp]} onPress={() => navigation.navigate('Recipes')}>
<Image source={require('../assets/cooking.png')}  style={styles.bonusImageRecipes}/>
<View style={styles.bonusInnerContainer}>
        <Text style={styles.bonusText1}>Recepten</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity style={[styles.bonusButtonRow2,styles.shadowProp]} onPress={() => navigation.navigate('Fridge')}>
      <Image source={require('../assets/groceries.png')}  style={styles.bonusImageGroceries} />


        <Text style={styles.bonusText1}>Mijn koelkast</Text>



</TouchableOpacity>
      <TouchableOpacity style={[styles.bonusButtonRow2,styles.shadowProp]} onPress={() => navigation.navigate('Coaching')}>
      <Image source={require('../assets/coaching.png')}  style={styles.bonusImageGroceries} />
        <Text style={styles.bonusText1}>Coaching</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.biggestButton} onPress={() => navigation.navigate('Footprint')}>
      <Image source={require('../assets/leaves.png')}  style={styles.bonusImageFootprint}/>


        <Text style={styles.bonusText1}>{firstName}'s voetafdruk</Text>

      </TouchableOpacity>

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
  back: {
    position: 'absolute',
    top: 60,
    left: 10,
},
front: {
    position: 'absolute',
    top: 60,
    right: 10,
},
shadowProp: {
  elevation: 20,
    shadowColor: 'black',
},
buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    top: 100,
  },
  image: {
    flex: 1,
    width: '100%',

},

weatherContainer: {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 10,
},
weatherImg: { 
  width:70,
  height:50,
  resizeMode: 'contain',

},
bonusInnerContainer: {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
},
bonusImageAH : {
  position: 'absolute',
  width: '80%',
  height: '100%',
  top: 0,
  left: 0,
  opacity: 0.5,

},
bonusImageGroceries : {
  position: 'absolute',
  width: '80%',
  height: '100%',
  resizeMode: 'contain',
  bottom: 0,
  left: 0,

},
bonusButton: {
    width: '49%',
    backgroundColor: '#7c804b',
    borderRadius: 15,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 0,
    overflow: 'hidden',
  },
  bonusButtonRow2: {
    width: '49%',
    backgroundColor: '#616340',
    borderRadius: 15,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 0,
    overflow: 'hidden',
  },
  bigButton: {
    width: '100%',
    backgroundColor: '#e68b02',
    borderRadius: 15,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
    overflow: 'hidden',
  },
  bigButtonWeather: {
    width: '100%',
    borderRadius: 15,
    height: 130,
    marginBottom: 20,
    marginTop: 20,
    overflow: 'hidden',
  },
  biggestButton: {
    width: '100%',
    backgroundColor: '#424423',
    borderRadius: 15,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 0,
    overflow: 'hidden',
  },
  bonusText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    zIndex: 1,
    fontWeight: 'bold',
  },
  bonusTextWeatherTitle: {
    color: '#424423',
    fontFamily: 'Vietnam',
    fontSize: 40,
    zIndex: 1,
    marginLeft: 10,
  },
  bonusTextWeatherMedium: {
    color: '#424423',
    fontFamily: 'Vietnam',
    fontSize: 28,
    zIndex: 1,
  },
  bonusTextWeatherSmall: {
    color: '#424423',
    fontFamily: 'Vietnam',
    fontSize: 15,
    zIndex: 1,
    marginLeft: 10,
  },
  weatherDescription: {
    display: 'flex',
    flexDirection: 'column',
  },
  bonusText1: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Vietnam',
    textAlign: 'center',
    zIndex: 1,
  },

  bonusImageRecipes: {
    position: 'absolute',
    width: '80%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0.5,
    
  },
  bonusImageFootprint: {
    position: 'absolute',
    width: '50%',
    height: '80%',
    resizeMode: 'contain',
    bottom: -20,
    left: 10,
    opacity: 0.5,
    
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },


});

  
