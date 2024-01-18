import { ModelOptions, prop } from '@typegoose/typegoose';
import type { DocumentType, Ref } from '@typegoose/typegoose';

import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  IUserProfileResp,
  IUserResp,
} from '../declarations/interfaces/user.interface';
import { generateAccessToken } from '../utils/token';
import { Article } from './article.entity';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class User extends TimeStamps {
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

  @prop({ ref: () => Article })
  public favouritedArticles!: Ref<Article>[];

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
      following: user ? user.isFollowing(this) : false,
    };
  }

  public isFollowing(
    this: DocumentType<User>,
    user: DocumentType<User>,
  ): boolean {
    return this._id.toString() === user._id.toString()
      ? false
      : this.followings.includes(user._id);
  }

  public isFavourited(
    this: DocumentType<User>,
    article: DocumentType<Article>,
  ) {
    return this.favouritedArticles.includes(article._id);
  }
}
