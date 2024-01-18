import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import CommentController from '../controllers/comment.controller';
import {
  TCommentCreateSchema,
  commentCreateSchema,
} from '../schemas/comment.schema';

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
    schema: {
      body: commentCreateSchema,
    },
    handler: async (
      request: FastifyRequest<{
        Params: { slug: string };
        Body: TCommentCreateSchema;
      }>,
      reply: FastifyReply,
    ) =>
      new CommentController(request.auth).addCommentsToArticle(
        request.params.slug,
        request.body,
      ),
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
    ) =>
      new CommentController(request.auth).getCommentsFromArticle(
        request.params.slug,
      ),
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
    ) =>
      new CommentController(request.auth).deleteComment(
        request.params.slug,
        request.params.id,
      ),
  });
};
