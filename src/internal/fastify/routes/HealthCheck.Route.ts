import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import mongoose, { STATES } from 'mongoose';

export default async (
  server: FastifyInstance,
  option: FastifyPluginOptions,
) => {
  server.route({
    method: 'GET',
    url: '/hc',
    config: {
      auth: false,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        mongoStatus: STATES[mongoose.connection.readyState],
      };

      return healthcheck;
    },
  });
};
