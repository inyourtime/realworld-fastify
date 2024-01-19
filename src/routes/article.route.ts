import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import ArticleController from '../controllers/article.controller';
import {
  TArticleCreateSchema,
  TArticleUpdateSchema,
  TArticlesListQuery,
  TBaseArticleQuery,
  articleCreateSchema,
  articleListQuery,
  articleUpdateSchema,
  baseArticleQuery,
} from '../schemas/article.schema';

export default async (server: FastifyInstance, option: FastifyPluginOptions) => {
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
    ) => new ArticleController(request.auth).listArticles(request.query),
  });

  server.route({
    method: 'GET',
    url: `${apiModule}/feed`,
    config: {
      auth: true,
    },
    schema: {
      querystring: baseArticleQuery,
    },
    handler: async (
      request: FastifyRequest<{ Querystring: TBaseArticleQuery }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).feedArticles(request.query),
  });

  server.route({
    method: 'GET',
    url: `${apiModule}/:slug`,
    config: {
      auth: false,
    },
    handler: async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) =>
      new ArticleController(request.auth).getArticle(request.params.slug),
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
    handler: async (request: FastifyRequest<{ Body: TArticleCreateSchema }>, reply: FastifyReply) =>
      new ArticleController(request.auth).createArticle(request.body),
  });

  server.route({
    method: 'PUT',
    url: `${apiModule}/:slug`,
    config: {
      auth: true,
    },
    schema: {
      body: articleUpdateSchema,
    },
    handler: async (
      request: FastifyRequest<{
        Params: { slug: string };
        Body: TArticleUpdateSchema;
      }>,
      reply: FastifyReply,
    ) => new ArticleController(request.auth).updateArticle(request.params.slug, request.body),
  });

  server.route({
    method: 'DELETE',
    url: `${apiModule}/:slug`,
    config: {
      auth: true,
    },
    handler: async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) =>
      new ArticleController(request.auth).deleteArticle(request.params.slug),
  });

  server.route({
    method: 'POST',
    url: `${apiModule}/:slug/favorite`,
    config: {
      auth: true,
    },
    handler: async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) =>
      new ArticleController(request.auth).favoriteArticle(request.params.slug),
  });

  server.route({
    method: 'DELETE',
    url: `${apiModule}/:slug/favorite`,
    config: {
      auth: true,
    },
    handler: async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) =>
      new ArticleController(request.auth).unFavoriteArticle(request.params.slug),
  });
};
