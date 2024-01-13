import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  MONGO_URL: str(),
  MONGO_DB: str(),
  PORT: num(),
});

export default env;
