import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class Article extends TimeStamps {
  // @prop({ required: true, default: () => randomUUID() })
  // public _id!: string;

  @prop({ unique: true, required: true })
  public slug!: string;

  @prop({ required: true })
  public title!: string;

  @prop({ required: false })
  public description?: string;

  @prop({ required: false })
  public body?: string;

  @prop({ type: () => [String] })
  public tags?: string[];

  @prop({ ref: () => User })
  public favouritedUsers?: Ref<User>[];

  @prop({ ref: () => User })
  public author!: Ref<User>;

  @prop({ ref: () => Comment })
  public comments?: Ref<Comment>[];
}

const ArticleModel = getModelForClass(Article);

export default ArticleModel;
