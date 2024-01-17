import FastifyServer from './internal/fastify';
import { ConnectMongo } from './internal/mongo/connection';
import env from './utils/env.util';

(async () => {
  const serverInstance = new FastifyServer().bootstrap();

  try {
    await Promise.allSettled([ConnectMongo(), serverInstance.start(env.PORT)]);
    console.log('[Server] has been initialized!');
  } catch (e) {
    console.error('Error starting server:', e);
  }
})();
