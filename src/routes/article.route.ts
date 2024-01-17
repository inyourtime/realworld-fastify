import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import ArticleController from '../controllers/article.controller';
import {
  TArticleCreateSchema,
  TArticlesListQuery,
  articleCreateSchema,
  articleListQuery,
} from '../schemas/article.schema';

export default async (
  server: FastifyInstance,
  option: FastifyPluginOptions,
) => {
  const apiModule = '/articles';

  server.route({
    method: 'GET',
    url: `${apiModule}`,
    config: {
      auth: 'OPTIONAL',
    },
    schema: {
      querystring: articleListQuery,
    },
    handler: async (
      request: FastifyRequest<{ Querystring: TArticlesListQuery }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).listArticles(),
  });

  server.route({
    method: 'GET',
    url: `${apiModule}/feed`,
    config: {
      auth: true,
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) =>
      new ArticleController(request.auth).feedArticles(),
  });

  server.route({
    method: 'GET',
    url: `${apiModule}/:slug`,
    config: {
      auth: false,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).getArticle(),
  });

  server.route({
    method: 'POST',
    url: `${apiModule}`,
    config: {
      auth: true,
    },
    schema: {
      body: articleCreateSchema,
    },
    handler: async (
      request: FastifyRequest<{ Body: TArticleCreateSchema }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).createArticle(request.body),
  });

  server.route({
    method: 'PUT',
    url: `${apiModule}/:slug`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).updateArticle(),
  });

  server.route({
    method: 'DELETE',
    url: `${apiModule}/:slug`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).deleteArticle(),
  });

  server.route({
    method: 'POST',
    url: `${apiModule}/:slug/favorite`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).favoriteArticle(),
  });

  server.route({
    method: 'DELETE',
    url: `${apiModule}/:slug/favorite`,
    config: {
      auth: true,
    },
    handler: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).unFavoriteArticle(),
  });
};
