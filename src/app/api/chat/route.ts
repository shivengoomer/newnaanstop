import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function isRecipeQuery(text: string) {
  const q = text.toLowerCase();
  return /recipe|recipes|dish|cuisine|ingredient|ingredients|cook(ing)?|time|servings|find|search|look for/.test(q);
}

function parseTimeToNumber(time: any): number | undefined {
  if (time == null) return undefined;
  const str = String(time);
  const m = str.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

function findMatches(recipes: any[], query: string) {
  const q = query.toLowerCase();
  const timeMatch = query.match(/(\d+)\s*(min|mins|minutes)/i);
  const maxTime = timeMatch ? parseInt(timeMatch[1], 10) : undefined;

  return recipes.filter((r) => {
    const name = (r.name || r.dishName || r.title || '').toString().toLowerCase();
    const category = (r.category || '').toString().toLowerCase();
    const ingredients = (r.ingredients || []).join(' ').toLowerCase();
    const author = (r.author || '').toString().toLowerCase();
    const timeNum = parseTimeToNumber(r.cookingTime || r.time || r.cookTime);

    const matchesText =
      name.includes(q) || category.includes(q) || ingredients.includes(q) || author.includes(q);

    const matchesTime = maxTime !== undefined ? (timeNum !== undefined ? timeNum <= maxTime : false) : true;

    return (matchesText || q === '') && matchesTime;
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Fetch all recipes from your own API using absolute URL derived from incoming request
    const recipesUrl = new URL('/api/recipes', (request as any).url).toString();
    const recipesRes = await fetch(recipesUrl);
    if (!recipesRes.ok) {
      console.error('Failed fetching recipes:', recipesRes.statusText);
      // proceed with empty array rather than throwing to allow fallback to Gemini
    }
    const recipesJson = await recipesRes.json().catch(() => null);
    const recipes = Array.isArray(recipesJson) ? recipesJson : recipesJson?.recipes || [];

    if (isRecipeQuery(text)) {
      const matches = findMatches(recipes, text);

      if (!matches || matches.length === 0) {
        return NextResponse.json({
          response:
            "Sorry, I couldn’t find an exact match, but you can browse more on the /recipe page: https://newnaanstop.vercel.app/recipe",
        });
      }

      // Build a concise natural-language reply based on matched recipes
      const top = matches.slice(0, 5).map((r) => {
        const name = r.name || r.dishName || r.title || 'Untitled';
        const cat = r.category ? ` (${r.category})` : '';
        const timeVal = r.cookingTime || r.time || r.cookTime;
        const timeNum = parseTimeToNumber(timeVal);
        const timeDisplay = timeNum ? ` • ${timeNum} mins` : '';
        const link = r.slug ? `https://newnaanstop.vercel.app/recipe/${r.slug}` : `https://newnaanstop.vercel.app/recipe`;
        return `- ${name}${cat}${timeDisplay} — ${link}`;
      }).join('\n');

      const reply = `Yes! I found ${matches.length} recipe(s) that might match your request:\n\n${top}\n\nExplore more on the Recipes page: https://newnaanstop.vercel.app/recipe`;

      return NextResponse.json({ response: reply, matchesCount: matches.length, matches: matches.slice(0, 10) });
    }

    // For non-recipe questions, fall back to Gemini
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `You are a helpful assistant.\n\nUser Message: ${text}\n`;
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
