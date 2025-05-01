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
You are a helpful assistant that helps users with recipes.
When a user asks about recipes (like for a cuisine, dish, ingredients, or cooking time), 
reply in natural language — do NOT return code or JSON. 

Example reply:
"Yes! I found some great Italian pasta recipes for you 🍝. 
You can explore all the details on our Recipe page link here https://newnaanstop.vercel.app/recipe."

If you don’t have matching recipes, politely say:
"Sorry, I couldn’t find an exact match, but you can check the /recipe page for more options!"

For non-recipe questions, just reply normally as a helpful assistant.

User message: ${text}
`;


    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json({ error: 'Failed to get response from Gemini' }, { status: 500 });
  }
}
