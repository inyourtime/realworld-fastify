import { verify, sign, VerifyErrors, JwtPayload, SignOptions } from 'jsonwebtoken';
import env from './env.util';
import { IAnyObject } from '../declarations/interfaces/base.interface';

export const generateAccessToken = (
  payload: IAnyObject = {},
  secret: string = env.ACCESS_TOKEN_SECRET,
  options: SignOptions = { expiresIn: '1d' },
): string => {
  return sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string = env.ACCESS_TOKEN_SECRET) => {
  const res: unknown = verify(token, secret, (err, decoded) => ({
    error: err,
    result: decoded,
  }));
  return res as {
    error: VerifyErrors | null;
    result: string | JwtPayload | undefined;
  };
};
