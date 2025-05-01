
import mongoose from 'mongoose';
const RecipeSchema = new mongoose.Schema({
  dishName: { type: String, required: true },
  category: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  difficulty: { type: String, required: true },
  imageUrl: { type: String },
  servings: { type: Number },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  author: { type: String },
  yt_link: { type: String },
}, {
  timestamps: true,
});

const RecipeModel = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

export default RecipeModel;  
