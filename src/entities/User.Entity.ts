import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose';
import type { DocumentType, Ref } from '@typegoose/typegoose';

import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { randomUUID } from 'crypto';
import { IUserResp } from '../declarations/interfaces/user.interface';
import { generateAccessToken } from '../utils/token';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class User extends TimeStamps {
  @prop({ required: true, default: () => randomUUID() })
  public _id!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ unique: true, required: true })
  public username!: string;

  @prop({ required: true, select: false })
  public password!: string;

  @prop({ required: false })
  public bio?: string;

  @prop({ required: false })
  public image?: string;

  @prop({ ref: () => User })
  public followers?: Ref<User>[];

  @prop({ ref: () => User })
  public followings?: Ref<User>[];

  // @prop({ ref: () => Article })
  // public articlesLiked?: Ref<Article>[];

  public toUserResponse(this: DocumentType<User>): IUserResp {
    return {
      email: this.email,
      token: generateAccessToken({
        user: {
          id: this._id,
          email: this.email,
        },
      }),
      username: this.username,
      bio: this.bio,
      image: this.image,
    };
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
