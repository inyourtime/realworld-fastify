import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import mongoose, { STATES } from 'mongoose';

export default (server: FastifyInstance, option: any, done: any) => {
  server.route({
    method: 'GET',
    url: '/hc',
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

  done();
};
