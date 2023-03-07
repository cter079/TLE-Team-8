import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Image, ScrollView,  Alert, ImageBackground} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Fridge() {
  const navigation = useNavigation();
  const [loading , setLoading] = useState(true);
  const [products, setProducts] = useState([]);
    const [username, setUsername] = useState('Loading...');
    const [product, setProduct] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [error , setError] = useState('');
    const [noProducts, setNoProducts] = useState(false);



  useEffect(() => {
    

    const getUsername = async () => {
        const username = await AsyncStorage.getItem('username');
        setUsername(username);
    };
const getProducts = async () => {
    
    if(username !== 'Loading...'){
        axios.get(`https://expressjsbackend.herokuapp.com/ingredients?username=${username}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                // setProducts(res.data.rows2);
                const products = [];
                for (let i = 0; i < res.data.rows2.length; i++) {
                    products.push(res.data.rows2[i].productname);
                }
                setProducts(products);
                setLoading(false);
                



            })
            .catch((error) => {
                console.log(error);
                setNoProducts(true);
            });
}

    
};

getUsername();
getProductsAfterForm();

}

, [username]);


const getProductsAfterForm = async () => {
    if(username !== 'Loading...'){
        axios.get(`https://expressjsbackend.herokuapp.com/api/ingredients?username=${username}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                // setProducts(res.data.rows2);
                const products = [];
                for (let i = 0; i < res.data.rows2.length; i++) {
                    products.push(res.data.rows2[i].productname);
                }
                setProducts(products);
                setLoading(false);
                



            })
            .catch((error) => {
                console.log(error);
            });
        
}
};





    
    const handlePress = () => {
      setIsFormVisible(!isFormVisible);
    }


    const handleSubmit = () => {
        if(username !== 'Loading...'){
            if(product !== ''){
                //dont allow weird characters like @ or # but allow spaces
        if(product.match(/^[a-zA-Z0-9 ]*$/)){
        axios.post(`https://expressjsbackend.herokuapp.com/api/ingredients`, {
            username: username,
            product: product,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                getProductsAfterForm();
                setIsFormVisible(false);



            })
            .catch((error) => {
                console.log(error);
            });
        }
        else{
            setError('Gebruik alleen letters en cijfers')
        }
    }
        else{
            setError('Vul een product in')

        }
        }

}

    



const handleDelete = (product) => {

    //first alert the user that he is about to delete something
    Alert.alert(    
        "Weet je het zeker?",
        "Je gaat " + product + " verwijderen",
        [
            {
                text: "Annuleren",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Verwijderen", onPress: () => deleteProduct(product) }
        ],
        { cancelable: true }
    );

const deleteProduct = (product) => {
    if(username !== 'Loading...'){
        axios.delete(`https://expressjsbackend.herokuapp.com/api/ingredients?username=${username}&product=${product}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                getProductsAfterForm();

            })
            .catch((error) => {
                console.log(error);
            });
    }
}
}


    return (
        <View style={styles.container}>

            <ImageBackground source={require('../assets/home.png')} style={styles.imageBackground} blurRadius={10}>   

        <View style ={styles.mainContainer}>

        {isFormVisible ? (
            <View style={styles.form}>
            <TouchableOpacity
                style={styles.frontForm}
                onPress={handlePress}>
                <Icon name='close-circle-outline' size={30} color='#424423' />
            </TouchableOpacity>
                <Text style={styles.question}>Wat heb je gekocht?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Product"
                    placeholderTextColor="#000"
                    onChangeText={(text) => setProduct(text)}
                />
                

                <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Toevoegen</Text>
                </TouchableOpacity>
                <Text style={styles.error}>{error}</Text>
            </View>
        ) : (
            <View>
            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="arrow-back" size={30} color="#424423" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.front}
                onPress={handlePress}>
                <Icon name='add-circle-outline' size={30} color='#424423' />
            </TouchableOpacity>
            <View style={[styles.bonusButtonRow2,styles.shadowProp]} onPress={() => navigation.navigate('Fridge')}>
      <Image source={require('../assets/groceries.png')}  style={styles.bonusImageGroceries} />


        <Text style={styles.bonusText1}>Mijn koelkast</Text>



</View>
            <View style={styles.list}>
            {loading ? (
                <TextInput editable={false} style={styles.listItemText}>Er zijn nog geen producten toegevoegd</TextInput>
            ) : (
                
                <ScrollView>
                <View style={styles.listItems}>
                {products.map((product) => (
                    <View style={styles.listItem} key={product}>
                        <TextInput editable={false}  style={styles.listItemText}>{product}</TextInput>
                        <TouchableOpacity style={styles.listItemIcon} onPress={() => handleDelete(product)}>
                            <Icon name='trash-outline' size={20} color='#424423' />
                        </TouchableOpacity>

                        </View>
                ))}
                </View>
                </ScrollView>
            )}
            </View>
            </View>


            

            
        )
            }

            </View>
            </ImageBackground>
            </View>

            
            

            )
  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
    },
    imageBackground :{
        position: 'absolute',
        flex: 1,
        resizeMode: "cover",
        height: '100%',
        width: '100%',

    },
    mainContainer: {
        paddingHorizontal: 20,
    },
    front: {
        position: 'absolute',
        top: 60,
        right: 0,
    },
    listItems: {
        maxHeight: 400,
        
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
      bonusImageGroceries : {
        position: 'absolute',
        width: '80%',
        height: '100%',
        resizeMode: 'contain',
        bottom: 0,
        left: 0,
      
      },
      bonusText1: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'Vietnam',
        textAlign: 'center',
        zIndex: 1,
      },
      loading : {
        fontSize: 15,
        textAlign: 'center',

      },

    frontForm: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    error : {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
    },
    back: {
        position: 'absolute',
        top: 60,
        left: 0,
        zIndex: 1,
    },
    form: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 300,
        top: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },

    circle: {
        marginTop: 0,
    },
    question: {
        fontSize: 20,
        textAlign: 'center',
        width: '80%',
        fontFamily: 'Vietnam',
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
    
    input: {
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 25,
        fontFamily: 'Vietnam',
        padding: 10,
        marginVertical: 10,
        width: '80%',
    },
    list: {
        width: '100%',
        maxHeight: '100%',
        backgroundColor: '#fff',
        borderRadius: 15,
overflow: 'hidden',    
paddingLeft: 10,   
paddingTop: 10, 
    },
    listItem: {
        flexDirection: 'row',
    },

    listItemText: {
        fontSize: 20,
        fontFamily: 'Caveat',
        width: '90%',
        borderTopColor: '#30b0ff',
        borderTopWidth: 1,
        borderLeftColor: 'red',
        overflow: 'hidden',
        color: '#000',
        borderLeftWidth: 1,
        paddingLeft: 10,
        paddingRight: 20,
        
        
    },
    listItemIcon: {
        width: '10%',
        alignItems: 'center',
        borderTopColor: '#30b0ff',
        borderTopWidth: 1,

    },
    
});




