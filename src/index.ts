import FastifyServer from './internal/fastify';
import { ConnectMongo } from './internal/mongo/connection';
import env from './utils/env.util';

(async () => {
  const serverInstance = FastifyServer.getInstance().bootstrap();

  try {
    await Promise.all([ConnectMongo(), serverInstance.start(env.PORT)]);
  } catch (e) {
    console.error('Error starting server:', e);
  }
})();
