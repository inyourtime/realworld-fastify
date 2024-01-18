import { getModelForClass } from '@typegoose/typegoose';
import { User } from './user.entity';
import { Article } from './article.entity';
import { Comment } from './comment.entity';

export const UserModel = getModelForClass(User);
export const ArticleModel = getModelForClass(Article);
export const CommentModel = getModelForClass(Comment);
