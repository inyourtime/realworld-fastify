import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoDb: MongoMemoryServer;

export async function connect(): Promise<void> {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
}

export async function cleanData(): Promise<void> {
  await mongoose.connection.db.dropDatabase();
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect();
  await mongoDb.stop();
}
