"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NewRecipe from "./NewRecipe";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/recipes"); // Fetch recipes from API
        setRecipes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes. Please try again later.");
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
      recipe.dishName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (recipe) =>
        selectedCategory === "" ||
        recipe.category?.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase(),
    );

  return (
    <section id="recipe" className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="mt-10 pt-10 text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-black dark:text-white mx-auto mb-4">
            Delicious Recipes Just for You
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover culinary masterpieces from around the world
          </p>
        </div>
        <div className="space-y-8 mb-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="relative w-full max-w-2xl group">
              <div className="absolute inset-0 bg-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <input
                type="text"
                placeholder="Search for your favorite recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all duration-300 text-base shadow-lg backdrop-blur-sm"
                aria-label="Search recipes"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
            <NewRecipe />
          </div>
        </div>

        <div className="flex justify-center gap-3 flex-wrap mb-12">
          {["", "Veg", "Non-Veg", "Egg"].map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? "bg-orange-400 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-400 shadow-md"
              }`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category === "" ? "All" : category}
            </button>
          ))}
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-orange-300 opacity-20"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Loading delicious recipes...
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="group relative rounded-2xl bg-gradient-to-b from-black/5 to-white dark:from-white/5 dark:to-black overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                onClick={() => openRecipeModal(recipe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openRecipeModal(recipe)}
              >
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src={recipe.imageUrl || "placeholder.jpg"}
                    alt={recipe.dishName || "Recipe Image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {recipe.dishName}
                  </h3>
                  <p className="text-sm font-medium text-orange-500 dark:text-orange-400 mb-4">
                    {recipe.category}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Time:</span>
                      <span>{recipe.cookingTime} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Level:</span>
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-orange-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {selectedRecipe && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
            onClick={closeRecipeModal}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-7xl w-full relative overflow-hidden max-h-[95vh] shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl hover:scale-110"
                onClick={closeRecipeModal}
                aria-label="Close modal"
              >
                <span className="text-2xl font-bold">✕</span>
              </button>

              <div className="overflow-y-auto max-h-[95vh] custom-scrollbar">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 lg:p-10">
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {selectedRecipe.dishName}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-white">
                        📁 {selectedRecipe.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-white">
                        ⏱️ {selectedRecipe.cookingTime} mins
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-white">
                        🍽️ {selectedRecipe.servings} servings
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-white">
                        📊 {selectedRecipe.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-10">
                  {/* Left Column - Image & Instructions */}
                  <div className="space-y-8">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                      <img
                        src={selectedRecipe.imageUrl || "placeholder.jpg"}
                        alt={selectedRecipe.dishName || "Recipe Image"}
                        className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-850 p-6 rounded-2xl shadow-lg">
                      <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="text-orange-500">📝</span> Instructions
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base">
                        {selectedRecipe.instructions}
                      </p>
                    </div>

                    {selectedRecipe.yt_link && (
                      <div className="space-y-4">
                        <h3 className="text-3xl ext-center font-bold text-gray-900 dark:text-white w-full flex items-center gap-3">
                          <span className="text-red-500">▶️</span> Video
                          Tutorial
                        </h3>
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                          <iframe
                            className="w-full h-full"
                            src={
                              selectedRecipe.yt_link.startsWith("https")
                                ? selectedRecipe.yt_link.replace(
                                    "watch?v=",
                                    "embed/",
                                  )
                                : selectedRecipe.yt_link.startsWith("http")
                                  ? selectedRecipe.yt_link
                                      .replace("http", "https")
                                      .replace("watch?v=", "embed/")
                                  : selectedRecipe.yt_link.replace(
                                      "watch?v=",
                                      "embed/",
                                    )
                            }
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Ingredients */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-850 p-8 rounded-2xl shadow-xl">
                      <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="text-green-500">🥘</span> Ingredients
                      </h3>
                      <ul className="space-y-4">
                        {selectedRecipe.ingredients.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-4 group"
                          >
                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md group-hover:scale-110 transition-transform">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 text-base pt-1 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedRecipe.author && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-850 p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">👨‍🍳</span>
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Recipe by
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {selectedRecipe.author}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recipes;
