import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Image, ScrollView, ImageBackground} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { generateRecipe } from './GenerateRecipes';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Recipes() {
  const [recipe, setRecipe] = useState('');
    const navigation = useNavigation();
const [ingredients, setIngredients] = useState([]);
const [username, setUsername] = useState('Loading...');
const [loading, setLoading] = useState('Wij laden momenteel uw dagelijkse recept gebaseerd op ingrediënten die u in huis heeft...');
const [recipeTitle, setRecipeTitle] = useState('');
const [recipeIngredients, setRecipeIngredients] = useState('');
const [recipeInstructions, setRecipeInstructions] = useState('');


React.useEffect(() => {
    const getFullName = async () => {
        const username = await AsyncStorage.getItem('username');
        setUsername(username);
    };
    getFullName();
}, []);

React.useEffect(() => {
    if (username !== 'Loading...') {
    
    axios.get(`https://expressjsbackend.herokuapp.com/api/ingredients?username=${username}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        const ingredients = [];
        for (let i = 0; i < response.data.rows2.length; i++) {
            ingredients.push(response.data.rows2[i].productname);
        }
        setIngredients(ingredients);
        


       

    })
    .catch((error) => {
        console.log(error);
    }
    );
    }

}, [username]);






  useEffect(() => {
    const fetchRecipe = async () => {
      const newRecipe = await generateRecipe(ingredients);
    

      const splitByLine = newRecipe
        .split('\n')
        .slice(1)
        .join('\n');


        //get the title from the recipe in the first line
        const splitTitle = splitByLine.split('\n')[1];
        const splitTitleOld = splitTitle.replace('Titel:', '');


        const recipeParts = splitByLine.split('\n');

// Find the index of the first occurrence of the "Ingredienten:" header
const ingredientsIndex = recipeParts.indexOf('Ingredienten:');


// Find the index of the first occurrence of the "Instructies:" header
const instructionsIndex = recipeParts.indexOf('Instructies:');


        //split the entire ingredients section from the recipe and store it in a variable
        const splitIngredientsOld = recipeParts.slice(ingredientsIndex, instructionsIndex).join('\n');
        //remove the "Ingredienten:" header from the ingredients section
        const splitIngredients = splitIngredientsOld.replace('Ingredienten:', '');
        console.log(splitIngredients);
        const splitInstructionsOld = recipeParts.slice(instructionsIndex).join('\n');
        const splitInstructions = splitInstructionsOld.replace('Instructies:', '');

   
        setRecipeIngredients(splitIngredients);
        setRecipeInstructions(splitInstructions);
setRecipeTitle(splitTitleOld);

      setRecipe(splitByLine);
      setLoading('');


    };
    if (ingredients.length > 0) {
        fetchRecipe();
      }
  }, [ingredients]);

  return (
    <View style={styles.container}>
                <ImageBackground source={require('../assets/home.png')} resizeMode='cover' style={styles.imageBackground} blurRadius={10}>

      <View style={styles.mainContainer}>
             <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Home')}>
               <Icon name="arrow-back" size={30} color="#424423" />
            </TouchableOpacity>

            <View style={[styles.bonusButton,styles.shadowProp]} onPress={() => navigation.navigate('Recipes')}>
<Image source={require('../assets/cooking.png')}  style={styles.bonusImageRecipes}/>
        <Text style={styles.bonusText1}>Recepten</Text>
      </View>
      
    <View style={styles.recipe}>
    <Text style={styles.historytitle}>Jouw dagelijkse recept</Text>
    <Text style={styles.loading}>{loading}</Text>
    <View style={styles.recipeItem1}>
    <Text style={styles.recipeTitleText}>{recipeTitle}</Text>
    </View>
    <View style={styles.recipeItem2}>
    <Image source={require('../assets/ingredients-icon.png')}  style={styles.ingredientsIcon}/>
    <ScrollView>

    <Text style={styles.recipeTitle}>Benodigdheden</Text>
    <Text style={styles.recipeText}>{recipeIngredients}</Text>
    </ScrollView>

    </View>

    <View style={styles.recipeItem3}>
    <Image source={require('../assets/cooking-instructions.png')}  style={styles.instructionsIcon}/>
    <ScrollView>
    <Text style={styles.recipeTitle}>Bereidingswijze</Text>
    <Text style={styles.recipeText}>{recipeInstructions}</Text>
    </ScrollView>

    </View>



    {/* <Text style={styles.loading}>{recipe}</Text> */}


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
    imageBackground: {
      flex: 1,
      width: '100%',
    
    },
    mainContainer: {
      paddingHorizontal: 20,
    },
    back: {
      position: 'absolute',
      top: 60,
      left: 10,
  },

  ingredientsIcon: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
    right: -100,
    top:10,
    opacity: 0.5,
  },
  instructionsIcon: {
    position: 'absolute',
    resizeMode: 'contain',
    opacity: 0.5,
    width: '100%',
bottom: -250,   
left: -120, 
  },
  front: {
      position: 'absolute',
      top: 60,
      right: 10,
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
  historytitle: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'VietnamBold',
    marginBottom: 10,
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
      paddingHorizontal: 20,
      top: 100,
    },
  
    loading: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Vietnam',
    },
    recipeItem1: {
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: '#424423',
      width: '100%',
      maxHeight: 1000,
      borderRadius: 15,
      paddingVertical: 20,
  },
    recipeItem2: {
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: '#616340',
      paddingLeft: 10,
      width: '100%',
      maxHeight: 200,
      borderRadius: 15,
      paddingVertical: 20,
      overflow: 'hidden',

  },
    recipeItem3: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#7c804b',
        width: '100%',
        maxHeight: 200,
        borderRadius: 15,
        padding: 20,
        overflow: 'hidden',

    },
    recipeTitleText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'VietnamBold',
        textAlign: 'center',
    },

    recipeTitle: {
        fontSize: 15,
        fontFamily: 'VietnamBold',
        color: 'white',
        textAlign: 'center',
    },
    bonusText: {
      color: 'white',
      fontSize: 30,
      textAlign: 'center',
      zIndex: 1,
      fontWeight: 'bold',
    },
    recipeText: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'Vietnam',
    },
    
  
    bonusImg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      
    },
    innerContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0, 0.30)',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    recipe: {
        width: '100%',
    },
  
  
  });
  


export default Recipes;