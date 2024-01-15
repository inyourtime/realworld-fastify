import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

export default async (
  server: FastifyInstance,
  option: FastifyPluginOptions,
) => {
  const apiModule = '/profiles';

  server.route({
    method: 'GET',
    url: `${apiModule}/:username`,
    config: {
      auth: false,
    },
    handler: async (
      request: FastifyRequest<{ Params: { username: string } }>,
      reply: FastifyReply,
    ) => {
      // must inplement
    },
  });

  server.route({
    method: 'POST',
    url: `${apiModule}/:username/follow`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { username: string } }>,
      reply: FastifyReply,
    ) => {
      // must inplement
    },
  });

  server.route({
    method: 'DELETE',
    url: `${apiModule}/:username/follow`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { username: string } }>,
      reply: FastifyReply,
    ) => {
      // must inplement
    },
  });
};
