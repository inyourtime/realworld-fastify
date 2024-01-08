import * as mongoose from 'mongoose';

export default async function MongoConnect() {
  await mongoose.connect(<string>process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB,
  });
  console.log('Mongodb has been initialize');
}
