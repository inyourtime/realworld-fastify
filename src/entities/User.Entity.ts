import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose';
import type { DocumentType, Ref } from '@typegoose/typegoose';

import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  IUserProfileResp,
  IUserResp,
} from '../declarations/interfaces/user.interface';
import { generateAccessToken } from '../utils/token';
import { Types } from 'mongoose';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class User extends TimeStamps {
  // @prop({ required: true, default: () => randomUUID() })
  // public _id!: string;

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
  public followers!: Ref<User>[];

  @prop({ ref: () => User })
  public followings!: Ref<User>[];

  // @prop({ ref: () => Article })
  // public articlesLiked?: Ref<Article>[];

  public toUserJSON(this: DocumentType<User>): IUserResp {
    return {
      email: this.email,
      token: generateAccessToken({
        user: {
          id: this._id.toString(),
          email: this.email,
        },
      }),
      username: this.username,
      bio: this.bio,
      image: this.image,
    };
  }

  public toProfileJSON(
    this: DocumentType<User>,
    user?: DocumentType<User>,
  ): IUserProfileResp {
    return {
      username: this.username,
      bio: this.bio,
      image: this.image,
      following: user ? user.isFollowing(this._id) : false,
    };
  }

  public isFollowing<T extends Types.ObjectId>(
    this: DocumentType<User>,
    id: T,
  ): boolean {
    return this.followings.includes(id);
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
