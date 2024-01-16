import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import UserProfileController from '../controllers/userProfile.controller';

export default async (
  server: FastifyInstance,
  option: FastifyPluginOptions,
) => {
  const apiModule = '/profiles';

  server.route({
    method: 'GET',
    url: `${apiModule}/:username`,
    config: {
      auth: 'OPTIONAL',
    },
    handler: async (
      request: FastifyRequest<{ Params: { username: string } }>,
      reply: FastifyReply,
    ) =>
      new UserProfileController(request.auth).getProfile(
        request.params.username,
      ),
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
    ) =>
      new UserProfileController(request.auth).followUser(
        request.params.username,
      ),
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
