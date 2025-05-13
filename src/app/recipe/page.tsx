'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NewRecipe from './NewRecipe';
interface Recipe {
  _id: string;
  dishName: string;
  category: string;
  cookingTime: number;
  difficulty: string;
  imageUrl?: string;
  servings?: number;
  ingredients: string[];
  instructions: string;
  author?: string;
  yt_link?: string;
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/recipes'); // Fetch recipes from API
        setRecipes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes. Please try again later.');
      }
      setIsLoading(false);
    };
    fetchRecipes();
  }, []);

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.dishName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((recipe) =>
      selectedCategory === '' ||
      recipe.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
    );

  return (
    <section id='recipe'>
      <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl lg:text-5xl font-semibold text-black dark:text-white mx-auto mt-20'>
            Delicious Recipes Just for You
          </h2>
        </div>
        <div>
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-2xl">
              <input
          type="text"
          placeholder="🔍 Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-center px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Search recipes"
              />
              <button
          onClick={() => setSearchTerm('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-orange-400 text-white rounded-lg hover:bg-orange-500 focus:outline-none"
          aria-label="Clear search"
              >
          Clear
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center my-8">
            <NewRecipe />
          </div>
        </div>
        

        <div className="flex justify-center gap-2 flex-wrap mb-6">
          {['', 'Veg', 'Non-Veg', 'Egg'].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full border transition ${selectedCategory === category ? 'bg-orange-400 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category === '' ? 'All' : category}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-400"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-5 mt-10">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="p-8 relative rounded-3xl bg-gradient-to-b from-black/5 to-white dark:from-white/5 dark:to-black shadow-md hover:shadow-xl cursor-pointer transition"
                onClick={() => openRecipeModal(recipe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openRecipeModal(recipe)}
              >
                <div className="w-full h-48 overflow-hidden rounded-lg">
                  <img
                    src={recipe.imageUrl || 'placeholder.jpg'}
                    alt={recipe.dishName || 'Recipe Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className='text-2xl text-black dark:text-white font-semibold text-center mt-4'>{recipe.dishName}</h3>
                <p className='text-lg font-normal text-black/50 dark:text-white/50 text-center mt-2'>{recipe.category}</p>
                <div className='text-sm mt-2 text-center text-gray-600 dark:text-gray-300'>
                  <p><strong>Cooking Time:</strong> {recipe.cookingTime} mins</p>
                  <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={closeRecipeModal}>
            <div className="bg-white dark:bg-black rounded-lg p-6 max-w-xl w-full relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-3 text-2xl font-bold text-orange-500 dark:text-orange-500" onClick={closeRecipeModal} aria-label="Close modal">&times;</button>
              <div className="w-full h-64 overflow-hidden rounded-lg">
                <img
                  src={selectedRecipe.imageUrl || 'placeholder.jpg'}
                  alt={selectedRecipe.dishName || 'Recipe Image'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-800 dark:text-gray-200">
                <p><strong>Category:</strong> {selectedRecipe.category}</p>
                <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
                <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
                <div>
                  <strong>Ingredients:</strong>
                  <ul className="list-disc list-inside">
                    {selectedRecipe.ingredients.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Instructions:</strong>
                  <p>{selectedRecipe.instructions}</p>
                </div>
                <p><strong>Author:</strong> {selectedRecipe.author}</p>
                {selectedRecipe.yt_link && (
                <div className="mt-4 justify-items-center align-center">
                  <strong>Watch Tutorial:</strong>
                  <iframe
                    width="560"
                    height="315"
                    src={selectedRecipe.yt_link.startsWith('http') 
                      ? selectedRecipe.yt_link.replace("watch?v=", "embed/") .replace('http','https')
                      : `{selectedRecipe.yt_link.replace("watch?v=", "embed/")}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
)}

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recipes;

