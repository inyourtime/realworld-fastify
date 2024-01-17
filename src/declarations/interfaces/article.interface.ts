import { Article } from '../../entities/article.entity';
// import { User } from '../../entities/user.entity';
import { IUserProfileResp } from './user.interface';

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
