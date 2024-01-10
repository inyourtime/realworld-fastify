import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import z from 'zod';

enum Car {
  BMW = 1,
  BENZ = 2,
}

const foo = z.object({
  email: z.string(),
  password: z.string(),
  carEnum: z.nativeEnum(Car),
});

export default (server: FastifyInstance, option: any, done: any) => {
  server.get('/', async (req, reply) => {
    reply.send('from route');
  });

  server.route({
    method: 'POST',
    url: '/',
    schema: {
      body: foo,
    },
    handler: async (
      request: FastifyRequest<{ Body: z.infer<typeof foo> }>,
      reply: FastifyReply,
    ) => {
      return request.body.carEnum === Car.BMW;
    },
  });

  done();
};
