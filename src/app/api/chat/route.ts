import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are a helpful assistant that manages recipes.

When a user asks to add a new recipe, begin a friendly, step-by-step conversation to collect the following information, one field at a time:

Dish name

Image URL

Category (e.g., Veg, Non-Veg, Dessert)

3–5 ingredients

Cooking time (in minutes)

Cooking instructions

Number of servings

Difficulty level (Easy, Medium, Hard)

Author name

Optional YouTube video link

Store the collected information in a recipe object as you go.

Once all the required fields are provided, automatically submit the recipe using:

axios.post('/api/recipes', recipe)
Then reply to the user with a success message like:
✅ "Your recipe for Dish Name has been added successfully! You can view it on the Recipes Page."

If there's an error during submission, show an appropriate error message.

When users ask for recipes (like based on dish, cuisine, ingredients, or cooking time), reply in natural language and link to the Recipe page:

"Yes! I found some great recipes for you 🍽️.
Explore them here: https://newnaanstop.vercel.app/recipe"

If no match is found, say:
"Sorry, I couldn’t find an exact match, but you can browse more on the /recipe page."

For non-recipe questions, respond normally as a helpful assistant.
User Message ${text}`;


    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json({ error: 'Failed to get response from Gemini' }, { status: 500 });
  }
}
