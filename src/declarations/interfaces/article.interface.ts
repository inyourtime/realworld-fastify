import { Types } from 'mongoose';
import { Article } from '../../entities/article.entity';
// import { User } from '../../entities/user.entity';
import { IUserProfileResp } from './user.interface';
import { Ref } from '@typegoose/typegoose';

export type TArticleResp = Pick<
  Article,
  | 'slug'
  | 'title'
  | 'description'
  | 'body'
  | 'tagList'
  | 'createdAt'
  | 'updatedAt'
>;

// export type TAuthorResp = Pick<User, 'username' | 'bio' | 'image'>;
// export interface IAuthorResp extends TAuthorResp {
//   following: boolean;
// }

export interface IArticleResp extends TArticleResp {
  favorited: boolean;
  favoritesCount: number;
  author: IUserProfileResp;
}

export interface IArticleQuery {
  tagList?: { $in: string[] };
  author?: Types.ObjectId;
  _id?: { $in: Ref<Article>[] };
}
