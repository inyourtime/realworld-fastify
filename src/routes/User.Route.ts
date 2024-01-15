import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyPluginOptions,
} from 'fastify';
import {
  TUserCreateSchema,
  TUserLoginSchema,
  TUserUpdateSchema,
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
} from '../schemas/user.schema';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import UserController from '../controllers/user.controller';

export default async (
  server: FastifyInstance,
  option: FastifyPluginOptions,
) => {
  const apiModuleUsers = '/users';
  const apiModuleUser = '/user';

  server.route({
    method: 'POST',
    url: `${apiModuleUsers}/login`,
    config: {
      auth: false,
    },
    schema: {
      body: userLoginSchema,
    },
    handler: async (
      request: FastifyRequest<{ Body: TUserLoginSchema }>,
      reply: FastifyReply,
    ) => new UserController().login(request.body),
  });

  server.route({
    method: 'POST',
    url: `${apiModuleUsers}`,
    config: {
      auth: false,
    },
    schema: {
      body: userCreateSchema,
    },
    handler: async (
      request: FastifyRequest<{ Body: TUserCreateSchema }>,
      reply: FastifyReply,
    ) => new UserController().register(request.body),
  });

  server.route({
    method: 'GET',
    url: `${apiModuleUser}`,
    config: {
      auth: true,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // must inplement
      console.log(request.auth)
      return true
    },
  });

  server.route({
    method: 'PUT',
    url: `${apiModuleUser}`,
    config: {
      auth: true,
    },
    schema: {
      body: userUpdateSchema,
    },
    handler: async (
      request: FastifyRequest<{ Body: TUserUpdateSchema }>,
      reply: FastifyReply,
    ) => {
      // must inplement
    },
  });
};
