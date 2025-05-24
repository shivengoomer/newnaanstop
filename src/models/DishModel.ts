import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for a hidden gem (place recommendation)
interface HiddenGem {
  name: string;
  location: string;
  rating: number;
}

interface Dish extends Document {
  name: string;
  image: string;
  category: string;
  hiddenGems: HiddenGem[];
}

const HiddenGemSchema = new Schema<HiddenGem>({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

// Main dish schema
const DishSchema = new Schema<Dish>({
  name: { type: String, required: true, unique: true, trim: true },
  image: { type: String, default: "" },
  category: { type: String, required: true },
  hiddenGems: {
    type: [HiddenGemSchema],
    validate: [
      (val: HiddenGem[]) => val.length <= 10,
      '{PATH} exceeds the limit of 10 hidden gem locations',
    ],
  },
});

export default mongoose.models.Dish || mongoose.model<Dish>('Dish', DishSchema);
