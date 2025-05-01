import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import RecipeModel from '@/models/RecipeModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const recipe = await RecipeModel.findById(id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json(recipe);
      } catch (err) {
        res.status(500).json({ message: (err as Error).message });
      }
      break;

    case 'PUT':
      try {
        const updated = await RecipeModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json(updated);
      } catch (err) {
        res.status(400).json({ message: (err as Error).message });
      }
      break;

    case 'DELETE':
      try {
        const deleted = await RecipeModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json({ message: 'Recipe deleted successfully' });
      } catch (err) {
        res.status(500).json({ message: (err as Error).message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
