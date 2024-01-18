import errors from '../constants/errors';
import { IArticleResp } from '../declarations/interfaces/article.interface';
import { IAnyObject } from '../declarations/interfaces/base.interface';
import { ArticleModel, UserModel } from '../entities';
import ApiError from '../internal/fastify/responseHandler/apiError';
import { STATUS_CODE } from '../internal/fastify/responseHandler/statusCode';
import { runTransaction } from '../internal/mongo/connection';

import {
  TArticleCreateSchema,
  TArticleUpdateSchema,
  TArticlesListQuery,
} from '../schemas/article.schema';
import BaseController from './base.controller';

export default class ArticleController extends BaseController {
  constructor(auth?: IAnyObject) {
    super(auth);
  }

  public async listArticles(query: TArticlesListQuery) {
    const { limit, offset, tag, author, favorited } = query;

    tag;
    author;
    favorited;
    const article = await ArticleModel.find({}, {}, { limit, skip: offset });

    return article;
  }

  public async feedArticles() {}

  public async getArticle(slug: string): Promise<{ article: IArticleResp }> {
    const article = await ArticleModel.findOne({ slug }, undefined, {
      populate: 'author',
    }).exec();
    if (!article) throw errors.ARTICLE_NOTFOUND;

    return {
      article: await article.toArticleJSON(),
    };
  }

  public async createArticle({
    article,
  }: TArticleCreateSchema): Promise<{ article: IArticleResp }> {
    const author = await UserModel.findById(this.getUserId()).exec();
    if (!author) throw errors.USER_NOTFOUND;

    const newArticle = new ArticleModel({ ...article, author });

    try {
      await newArticle.save();
      return {
        article: await newArticle.toArticleJSON(author),
      };
    } catch (e: any) {
      if (e.code === 11000) {
        throw errors.ARTICLE_EXIST;
      }
      throw e;
    }
  }

  public async updateArticle(
    slug: string,
    { article }: TArticleUpdateSchema,
  ): Promise<{ article: IArticleResp }> {
    const { title, description, body, tagList } = article;

    const loginUser = await UserModel.findById(this.getUserId()).exec();
    if (!loginUser) throw errors.USER_NOTFOUND;

    const target = await ArticleModel.findOne({ slug }).exec();
    if (!target) throw errors.ARTICLE_NOTFOUND;

    if (target.author.toString() !== loginUser._id.toString()) {
      throw ApiError.createError('You cannot do this', STATUS_CODE.FORBIDDEN);
    }

    if (title) {
      target.title = title;
    }
    if (description) {
      target.description = description;
    }
    if (body) {
      target.body = body;
    }
    if (tagList) {
      target.tagList = tagList;
    }

    try {
      await target.save();
      return {
        article: await target.toArticleJSON(loginUser),
      };
    } catch (e: any) {
      if (e.code === 11000) {
        throw errors.ARTICLE_EXIST;
      }
      throw e;
    }
  }

  public async deleteArticle(slug: string) {
    const loginUser = await UserModel.findById(this.getUserId()).exec();
    if (!loginUser) throw errors.USER_NOTFOUND;

    const target = await ArticleModel.findOne({ slug }).exec();
    if (!target) throw errors.ARTICLE_NOTFOUND;

    if (target.author.toString() !== loginUser._id.toString()) {
      throw ApiError.createError('You cannot do this', STATUS_CODE.FORBIDDEN);
    }

    await ArticleModel.deleteOne({ slug });

    return {
      message: 'Article successfully deleted!!!',
    };
  }

  public async favoriteArticle(
    slug: string,
  ): Promise<{ article: IArticleResp }> {
    const loginUser = await UserModel.findById(this.getUserId()).exec();
    if (!loginUser) throw errors.USER_NOTFOUND;

    const article = await ArticleModel.findOne({ slug }).exec();
    if (!article) throw errors.ARTICLE_NOTFOUND;

    if (!loginUser.isFavourited(article)) {
      article.favouritedUsers.push(loginUser._id);
      loginUser.favouritedArticles.push(article._id);

      await runTransaction(async (session) => {
        await article.save({ session });
        await loginUser.save({ session });
      });
    }

    return {
      article: await article.toArticleJSON(loginUser),
    };
  }

  public async unFavoriteArticle(
    slug: string,
  ): Promise<{ article: IArticleResp }> {
    const loginUser = await UserModel.findById(this.getUserId()).exec();
    if (!loginUser) throw errors.USER_NOTFOUND;

    const article = await ArticleModel.findOne({ slug }).exec();
    if (!article) throw errors.ARTICLE_NOTFOUND;

    if (loginUser.isFavourited(article)) {
      article.favouritedUsers = article.favouritedUsers.filter(
        (userId) => userId.toString() !== loginUser._id.toString(),
      );
      loginUser.favouritedArticles = loginUser.favouritedArticles.filter(
        (articleId) => articleId.toString() !== article._id.toString(),
      );

      await runTransaction(async (session) => {
        await article.save({ session });
        await loginUser.save({ session });
      });
    }

    return {
      article: await article.toArticleJSON(loginUser),
    };
  }
}
