import { FastifyInstance } from 'fastify';

export default (server: FastifyInstance, option: any, done: any) => {
  server.get('/', async (req, reply) => {
    reply.send('from route');
  });

  done();
};
