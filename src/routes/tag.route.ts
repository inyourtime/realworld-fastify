import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import TagContrtoller from '../controllers/tag.controller';

export default async (server: FastifyInstance, option: FastifyPluginOptions) => {
  const apiModule = '/tags';

  server.route({
    method: 'GET',
    url: `${apiModule}`,
    config: {
      auth: false,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) =>
      new TagContrtoller(request.auth).getTags(),
  });
};
