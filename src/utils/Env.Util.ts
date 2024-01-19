import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  MONGO_URL: str(),
  MONGO_DB: str(),
  PORT: num(),
  ACCESS_TOKEN_SECRET: str(),
  S3_ACCOUNT_ID: str(),
  S3_ACCESS_KEY_ID: str(),
  S3_SECRET_ACCESS_KEY: str(),
  S3_BUCKET: str()
});

export default env;
