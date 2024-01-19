import { ModelOptions, prop } from '@typegoose/typegoose';
import type { DocumentType, Ref } from '@typegoose/typegoose';

import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { IUserProfileResp, IUserResp } from '../declarations/interfaces/user.interface';
import { generateAccessToken } from '../utils/token';
import { Article } from './article.entity';
import { runTransaction } from '../internal/mongo/connection';
import { filterOutRef } from './util';

export interface User extends Base {}
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

  public toProfileJSON(this: DocumentType<User>, user?: DocumentType<User>): IUserProfileResp {
    return {
      username: this.username,
      bio: this.bio,
      image: this.image,
      following: user ? user.isFollowing(this) : false,
    };
  }

  public isFollowing(this: DocumentType<User>, user: DocumentType<User>): boolean {
    return this._id.toString() === user._id.toString() ? false : this.followings.includes(user._id);
  }

  public isFavourited(this: DocumentType<User>, article: DocumentType<Article>) {
    return this.favouritedArticles.includes(article._id);
  }

  public async follow(this: DocumentType<User>, user: DocumentType<User> /* target user */) {
    if (!this.isFollowing(user) && !this._id.equals(user._id)) {
      this.followings.push(user._id);
      user.followers.push(this._id);

      await runTransaction(async (session) => {
        await this.save({ session });
        await user.save({ session });
      });
    }
  }

  public async unFollow(this: DocumentType<User>, user: DocumentType<User> /* target user */) {
    if (this.isFollowing(user)) {
      this.followings = filterOutRef(this.followings, user);
      user.followers = filterOutRef(user.followers, this);

      await runTransaction(async (session) => {
        await this.save({ session });
        await user.save({ session });
      });
    }
  }

  public async favorite(this: DocumentType<User>, article: DocumentType<Article>) {
    if (!this.isFavourited(article)) {
      article.favouritedUsers.push(this._id);
      this.favouritedArticles.push(article._id);

      await runTransaction(async (session) => {
        await article.save({ session });
        await this.save({ session });
      });
    }
  }

  public async unFavorite(this: DocumentType<User>, article: DocumentType<Article>) {
    if (this.isFavourited(article)) {
      article.favouritedUsers = filterOutRef(article.favouritedUsers, this);
      this.favouritedArticles = filterOutRef(this.favouritedArticles, article);

      await runTransaction(async (session) => {
        await article.save({ session });
        await this.save({ session });
      });
    }
  }
}
