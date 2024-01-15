import * as bcrypt from 'bcrypt';
import to from './await-to-js';

export const hashPassword = async (plain: string) =>
  new Promise<string>(async (resolve, reject) => {
    const [err, hash] = await to(bcrypt.hash(plain, bcrypt.genSaltSync(10)));
    if (err) return reject(err);
    return resolve(hash);
  });

export const checkPassword = async (hash: string, plain: string) =>
  new Promise<boolean>(async (resolve, reject) => {
    const [err, result] = await to(bcrypt.compare(plain, hash));
    if (err) return reject(err);
    return resolve(result);
  });
