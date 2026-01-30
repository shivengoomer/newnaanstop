"use client";

import { useState } from "react";
import clsx from "clsx";

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

/* -------------------- Helpers -------------------- */

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

function VideoPreview({ url }: { url: string }) {
  const [loadVideo, setLoadVideo] = useState(false);
  const videoId = getYoutubeId(url);

  if (!videoId) return null;

  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
      {!loadVideo ? (
        <button
          type="button"
          onClick={() => setLoadVideo(true)}
          className="relative w-full group"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Video thumbnail"
            className="h-48 w-full object-cover opacity-80 transition group-hover:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-orange-400 px-6 py-3 text-white font-semibold shadow-lg hover:bg-orange-500 transition-all">
              ▶ Play Preview
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="h-48 w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
        />
      )}
    </div>
  );
}

/* -------------------- Component -------------------- */

export default function NewRecipe() {
  const [showModal, setShowModal] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    dishName: "",
    imageUrl: "",
    category: "",
    ingredients: [""],
    cookingTime: 0,
    instructions: "",
    servings: 1,
    difficulty: "",
    author: "",
    yt_link: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
  ) => {
    const { name, value } = e.target;

    if (name === "ingredients" && typeof index === "number") {
      const updated = [...recipe.ingredients];
      updated[index] = value;
      setRecipe({ ...recipe, ingredients: updated });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData = {
      ...recipe,
      ingredients: recipe.ingredients.filter((i) => i.trim() !== ""),
    };

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (res.ok) {
        setShowModal(false);
        window.location.reload();
      } else {
        alert("Failed to submit recipe. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="px-8 py-4 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform whitespace-nowrap"
      >
        <span className="flex items-center gap-2 text-lg">
          <span className="text-2xl">✨</span>
          Add New Recipe
        </span>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between border-b-2 border-orange-200 dark:border-orange-800 pb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl">🍳</span> Create Your Recipe
              </h1>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white text-2xl font-bold transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    name="dishName"
                    placeholder="Enter delicious dish name..."
                    value={recipe.dishName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={recipe.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    value={recipe.category}
                    onChange={(e) =>
                      setRecipe({ ...recipe, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                  >
                    <option value="">Select category...</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Egg">Egg</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                      Cooking Time (mins)
                    </label>
                    <input
                      type="number"
                      name="cookingTime"
                      placeholder="30"
                      value={recipe.cookingTime || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                      Servings
                    </label>
                    <input
                      type="number"
                      name="servings"
                      placeholder="4"
                      value={recipe.servings || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Difficulty Level
                  </label>
                  <div className="flex gap-3">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() =>
                          setRecipe({ ...recipe, difficulty: level })
                        }
                        className={clsx(
                          "flex-1 px-4 py-3 rounded-xl border-2 font-semibold transition-all",
                          recipe.difficulty === level
                            ? "bg-orange-400 text-white border-orange-400 shadow-lg scale-105"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:border-orange-400 dark:hover:border-orange-400",
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Chef's name..."
                    value={recipe.author}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    YouTube Video Link
                  </label>
                  <input
                    type="text"
                    name="yt_link"
                    placeholder="https://youtube.com/watch?v=..."
                    value={recipe.yt_link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                    Ingredients
                  </label>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    {recipe.ingredients.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-7 h-7 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          name="ingredients"
                          value={item}
                          onChange={(e) => handleChange(e, idx)}
                          placeholder={`Ingredient ${idx + 1}`}
                          className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedIngredients =
                              recipe.ingredients.filter((_, i) => i !== idx);
                            setRecipe({
                              ...recipe,
                              ingredients: updatedIngredients,
                            });
                          }}
                          className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setRecipe({
                        ...recipe,
                        ingredients: [...recipe.ingredients, ""],
                      })
                    }
                    className="mt-3 w-full py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    + Add Ingredient
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Cooking Instructions
                  </label>
                  <textarea
                    name="instructions"
                    placeholder="Describe the cooking steps..."
                    value={recipe.instructions}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-all resize-none"
                  />
                </div>

                {recipe.yt_link && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                      Video Preview:
                    </h3>
                    <VideoPreview url={recipe.yt_link} />
                  </div>
                )}
              </div>

              {/* Submit Button - Full Width */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  🎉 Submit Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
