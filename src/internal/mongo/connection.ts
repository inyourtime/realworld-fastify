import * as mongoose from 'mongoose';

export default async function MongoConnect() {
  await mongoose.connect(
    'mongodb+srv://boat:M0BANRMzNyliNg7j@cluster0.fvbf9.mongodb.net/libra',
    { dbName: 'libra' },
  );
  console.log('Mongodb has been initialize');
}
