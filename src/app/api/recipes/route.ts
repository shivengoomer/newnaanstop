// app/api/recipes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import RecipeModel from '@/models/RecipeModel';
import dbConnect from '@/lib/dbConnect';

// Fetch recipes
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const recipes = await RecipeModel.find(); // Fetch all recipes
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ message: 'Error fetching recipes' }, { status: 500 });
  }
}

// Post a new recipe
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const newRecipe = await request.json();
    const recipe = new RecipeModel(newRecipe);
    await recipe.save(); // Save new recipe to DB
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ message: 'Error creating recipe' }, { status: 500 });
  }
}
