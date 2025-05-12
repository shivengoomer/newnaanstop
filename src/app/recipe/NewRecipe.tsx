'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Recipe {
  dishName: string;
  imageUrl: string;
  category: string;
  ingredients: string[];
  cookingTime: number;
  instructions: string;
  servings: number;
  difficulty: string;
  author: string;
  yt_link: string;
}

export default function NewRecipe() {
  const [showModal, setShowModal] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    dishName: '',
    imageUrl: '',
    category: '',
    ingredients:[''],
    cookingTime: 0,
    instructions: '',
    servings: 1,
    difficulty: '',
    author: '',
    yt_link: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === 'ingredients' && typeof index === 'number') {
      const updatedIngredients = [...recipe.ingredients];
      updatedIngredients[index] = value;
      setRecipe({ ...recipe, ingredients: updatedIngredients });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleDifficultySelect = (level: string) => {
    setRecipe({ ...recipe, difficulty: level });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prepare the recipe data
    const recipeData = {
      dishName: recipe.dishName,
      imageUrl: recipe.imageUrl,
      category: recipe.category,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime,
      instructions: recipe.instructions,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      author: recipe.author,
      yt_link: recipe.yt_link,
    };
  
    try {
      // Make the POST request
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Recipe successfully submitted:', data);
        setShowModal(false);
        // You can reset the form here if needed
        setRecipe({
          dishName: '',
          imageUrl: '',
          category: '',
          ingredients: ['', '', '', ''],
          cookingTime: 0,
          instructions: '',
          servings: 1,
          difficulty: '',
          author: '',
          yt_link: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Error submitting recipe:', errorData);
      }
    } catch (error) {
      console.error('An error occurred while submitting the recipe:', error);
    }
  };
  

  return (
    <div className="relative">
      <div className='flex justify-center'> <button
      onClick={() => setShowModal(true)}
      className="text-l font-medium rounded-full text-white py-5 px-6 bg-primary hover:text-primary border border-primary hover:bg-transparent text-center"
      >
      New Recipe
      </button>

      </div>
     


      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-black/90 text-white dark:text-white w-full max-w-3xl rounded-lg p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header with Close Button and ThemeToggler */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-center">Add New Recipe</h1>
              <div className="flex items-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="ml-4 text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="dishName"
                placeholder="Dish Name"
                value={recipe.dishName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                required
              />

              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={recipe.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category (Veg, Non-Veg, Egg......)"
                value={recipe.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
              />

              <div>
                <label className="block text-sm font-semibold mb-2">Ingredients</label>
                {recipe.ingredients.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    name="ingredients"
                    value={item}
                    onChange={(e) => handleChange(e, idx)}
                    placeholder={`Ingredient ${idx + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== idx);
                    setRecipe({ ...recipe, ingredients: updatedIngredients });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] })}
                  className="text-blue-500 hover:text-blue-700"
                >
                  + Add Ingredient
                </button>
              </div>
              <label className="block color-black text-sm font-semibold mb-2">Cooking Time</label>

              <input
                type="number"
                name="cookingTime"
                placeholder="Cooking Time (in minutes)"
                value={recipe.cookingTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
              />

              <textarea
                name="instructions"
                placeholder="Cooking Instructions"
                value={recipe.instructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
              />
              <label className="block text-sm font-semibold mb-2">Servings</label>

              <input
                type="number"
                name="servings"
                placeholder="Servings"
                value={recipe.servings}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
              />

              <div>
                <label className="block text-sm font-semibold mb-2">Difficulty</label>
                <div className="flex gap-4">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => handleDifficultySelect(level)}
                      className={clsx(
                        'px-4 py-2 rounded-md border transition',
                        recipe.difficulty === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                name="author"
                placeholder="Author Name"
                value={recipe.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
                required
              />

              <input
                type="text"
                name="yt_link"
                placeholder="YouTube Video Link"
                value={recipe.yt_link}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
              />

              {recipe.yt_link && (
                <div className="mt-4">
                  <h2 className="text-md font-semibold mb-2">Video Preview:</h2>
                  <iframe
                    width="100%"
                    height="315"
                    src={recipe.yt_link.replace('watch?v=', 'embed/')}
                    title="YouTube Preview"
                    allowFullScreen
                    className="rounded-lg border"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
              >
                Submit Recipe
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
