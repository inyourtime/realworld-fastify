import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export default function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // console.log('this.from error handler')
  reply.send(error);
}
