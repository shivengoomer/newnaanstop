// lib/db.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_DB as string;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_DB environment variable');
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGO_URI);
}

export default dbConnect;
