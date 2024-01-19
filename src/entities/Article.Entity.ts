import { ModelOptions, isDocument, pre, prop } from '@typegoose/typegoose';
import type { DocumentType, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import slugify from 'slugify';
import { IArticleResp } from '../declarations/interfaces/article.interface';
import errors from '../constants/errors';
import { IUserProfileResp } from '../declarations/interfaces/user.interface';
import { CommentModel, UserModel } from '.';
import { runTransaction } from '../internal/mongo/connection';
import { filterOutRef } from './util';

export interface Article extends Base {}
@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
@pre<Article>('save', function () {
  this.slug = slugify(this.title, { lower: true, replacement: '-' });
})
export class Article extends TimeStamps {
  @prop({ unique: true, lowercase: true })
  public slug!: string;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public body!: string;

  @prop({ type: () => [String] })
  public tagList!: string[];

  @prop({ ref: () => User })
  public favouritedUsers!: Ref<User>[];

  @prop({ ref: () => User })
  public author!: Ref<User>;

  @prop({ ref: () => Comment })
  public comments!: Ref<Comment>[];

  public async toArticleJSON(
    this: DocumentType<Article>,
    user?: DocumentType<User>,
  ): Promise<IArticleResp> {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favorited: user ? user.isFavourited(this) : false,
      favoritesCount: this.favouritedUsers.length,
      author: await this.getAuthorObject(user),
    };
  }

  public async getAuthorObject(
    this: DocumentType<Article>,
    user?: DocumentType<User>,
  ): Promise<IUserProfileResp> {
    return isDocument(this.author)
      ? this.author.toProfileJSON(user)
      : UserModel.findById(this.author)
          .exec()
          .then((author) => {
            if (!author) throw errors.USER_NOTFOUND;
            return author.toProfileJSON(user);
          });
  }

  public async addComment(this: DocumentType<Article>, comment: DocumentType<Comment>) {
    this.comments.push(comment);

    await runTransaction(async (session) => {
      await comment.save({ session });
      await this.save({ session });
    });
  }

  public async deleteComment(this: DocumentType<Article>, comment: DocumentType<Comment>) {
    this.comments = filterOutRef(this.comments, comment);

    await runTransaction(async (session) => {
      await CommentModel.deleteOne({ _id: comment._id }, { session });
      await this.save({ session });
    });
  }
}
