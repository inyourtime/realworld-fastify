import { isDocument } from '@typegoose/typegoose';
import errors from '../constants/errors';
import { IAnyObject } from '../declarations/interfaces/base.interface';
import { ICommentResp } from '../declarations/interfaces/comment.interface';
import { ArticleModel, CommentModel, UserModel } from '../entities';
import { runTransaction } from '../internal/mongo/connection';
import { TCommentCreateSchema } from '../schemas/comment.schema';
import BaseController from './base.controller';
import ApiError from '../internal/fastify/responseHandler/apiError';
import { STATUS_CODE } from '../internal/fastify/responseHandler/statusCode';

export default class CommentController extends BaseController {
  constructor(auth?: IAnyObject) {
    super(auth);
  }

  public async addCommentsToArticle(
    slug: string,
    { comment }: TCommentCreateSchema,
  ): Promise<{ comment: ICommentResp }> {
    const author = await UserModel.findById(this.getUserId()).exec();
    if (!author) throw errors.USER_NOTFOUND;

    const article = await ArticleModel.findOne({ slug }).exec();
    if (!article) throw errors.ARTICLE_NOTFOUND;

    const newComment = new CommentModel({ ...comment, author });
    article.comments.push(newComment);

    await runTransaction(async (session) => {
      await newComment.save({ session });
      await article.save({ session });
    });

    return {
      comment: await newComment.toCommentJSON(author),
    };
  }

  public async getCommentsFromArticle(
    slug: string,
  ): Promise<{ comments: ICommentResp[] }> {
    const article = await ArticleModel.findOne({ slug })
      .populate({
        path: 'comments',
        populate: { path: 'author' },
      })
      .exec();
    if (!article) throw errors.ARTICLE_NOTFOUND;

    return this.auth
      ? UserModel.findById(this.getUserId())
          .exec()
          .then(async (loginUser) => {
            if (!loginUser) throw errors.USER_NOTFOUND;
            return {
              comments: await Promise.all(
                article.comments.map(async (comment) =>
                  isDocument(comment)
                    ? comment.toCommentJSON(loginUser)
                    : ({} as ICommentResp),
                ),
              ),
            };
          })
      : {
          comments: await Promise.all(
            article.comments.map(async (comment) =>
              isDocument(comment)
                ? comment.toCommentJSON()
                : ({} as ICommentResp),
            ),
          ),
        };
  }

  public async deleteComment(slug: string, id: string) {
    const commenter = await UserModel.findById(this.getUserId()).exec();
    if (!commenter) throw errors.USER_NOTFOUND;

    const article = await ArticleModel.findOne({ slug }).exec();
    if (!article) throw errors.ARTICLE_NOTFOUND;

    const comment = await CommentModel.findById(id).exec();
    if (!comment) throw errors.COMMENT_NOTFOUND;

    if (commenter._id.toString() !== comment.author._id.toString()) {
      throw ApiError.createError('You cannot do this', STATUS_CODE.FORBIDDEN);
    }

    article.comments = article.comments.filter(
      (commentId) => commentId.toString() !== comment._id.toString(),
    );

    await runTransaction(async (session) => {
      await CommentModel.deleteOne({ _id: comment._id }, { session });
      await article.save({ session });
    });

    return {
      message: 'comment has been successfully deleted!!!',
    };
  }
}
