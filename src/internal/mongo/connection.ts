import mongoose from 'mongoose';
import env from '../../utils/Env.Util';

export const ConnectMongo = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    mongoose
      .connect(env.MONGO_URL, { dbName: env.MONGO_DB })
      .then(() => {
        console.log('Mongodb has been initialize');
        resolve();
      })
      .catch((e) => reject(e));
  });
