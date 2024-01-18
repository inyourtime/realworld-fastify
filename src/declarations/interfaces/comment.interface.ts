import { Comment } from '../../entities/comment.entity';
import { IUserProfileResp } from './user.interface';

export type TCommentResp = Pick<Comment, 'body' | 'createdAt' | 'updatedAt'>;

export interface ICommentResp extends TCommentResp {
  id: string;
  author: IUserProfileResp;
}
