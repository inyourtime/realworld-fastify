import mongoose, { ClientSession } from 'mongoose';
import env from '../../utils/env.util';

export const ConnectMongo = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    mongoose
      .connect(env.MONGO_URL, { dbName: env.MONGO_DB })
      .then(() => {
        console.log('[Mongodb] has been initialized!');
        resolve();
      })
      .catch((e) => reject(e));
  });

type TransactionCallback<T> = (session: ClientSession) => Promise<T>;

export async function runTransaction<T>(transactionCallback: TransactionCallback<T>): Promise<T> {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await transactionCallback(session);
    await session.commitTransaction();

    return result;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
}
