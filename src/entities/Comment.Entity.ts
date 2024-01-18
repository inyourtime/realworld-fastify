import { ModelOptions, isDocument, prop } from '@typegoose/typegoose';
import type { DocumentType, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user.entity';
import { IUserProfileResp } from '../declarations/interfaces/user.interface';
import { UserModel } from '.';
import errors from '../constants/errors';
import { ICommentResp } from '../declarations/interfaces/comment.interface';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class Comment extends TimeStamps {
  @prop()
  public body!: string;

  @prop({ ref: () => User })
  public author!: Ref<User>;

  public async toCommentJSON(
    this: DocumentType<Comment>,
    user?: DocumentType<User>,
  ): Promise<ICommentResp> {
    return {
      id: this._id.toString(),
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: await this.getAuthorObject(user),
    };
  }

  public async getAuthorObject(
    this: DocumentType<Comment>,
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
}
