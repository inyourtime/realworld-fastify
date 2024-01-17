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
  const apiModule = '/articles';

  server.route({
    method: 'POST',
    url: `${apiModule}/:slug/comments`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => {},
  });

  server.route({
    method: 'GET',
    url: `${apiModule}/:slug/comments`,
    config: {
      auth: 'OPTIONAL',
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => {},
  });

  server.route({
    method: 'DELETE',
    url: `${apiModule}/:slug/comments/:id`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string; id: string } }>,
      reply: FastifyReply,
    ) => {},
  });
};
