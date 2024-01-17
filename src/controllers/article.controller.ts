import errors from '../constants/errors';
import { IArticleResp } from '../declarations/interfaces/article.interface';
import { IAnyObject } from '../declarations/interfaces/base.interface';
import ArticleModel from '../entities/article.entity';
import UserModel from '../entities/user.entity';
import {
  TArticleCreateSchema,
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

  public async updateArticle() {}

  public async deleteArticle() {}

  public async favoriteArticle() {}

  public async unFavoriteArticle() {}
}
