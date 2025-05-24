
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DishModel from '@/models/DishModel';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { dishName, name, location, rating } = await request.json();

    // Validate input
    if (!dishName || !name || !location || typeof rating !== 'number') {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const recipe = await DishModel.findOne({ name: dishName });
    if (!recipe) {
      return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
    }

    if (recipe.hiddenGems.length >= 10) {
      return NextResponse.json({ message: 'Maximum 10 hidden gems allowed per dish.' }, { status: 400 });
    }

    recipe.hiddenGems.push({ name, location, rating });
    await recipe.save();

    return NextResponse.json({ message: 'Gem added successfully', recipe }, { status: 200 });
  } catch (error) {
    console.error('Error adding gem:', error);
    return NextResponse.json({ message: 'Error adding gem' }, { status: 500 });
  }
}
