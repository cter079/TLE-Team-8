import OpenAIApi from 'openai-api';


const openai = new OpenAIApi('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');

export async function generateRecipe(ingredients) {
  const prompt = `Maak een kookrecept voor mij met de volgende ingredienten: ${ingredients.join(', ')} splits het in Titel, Ingredienten en Instructies. Gebruik celcius`;
    const response = await openai.complete({    
    engine: 'text-davinci-003',
    prompt,
    maxTokens: 500,
    temperature: 0.8,
    });

 
const recipe = response.data.choices[0].text;
  return recipe;
}