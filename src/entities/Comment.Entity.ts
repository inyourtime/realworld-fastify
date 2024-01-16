import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user.entity';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class Comment extends TimeStamps {
  // @prop({ required: true, default: () => randomUUID() })
  // public _id!: string;

  @prop()
  public body!: string;

  @prop({ ref: () => User })
  public author!: Ref<User>;
}

const CommentModel = getModelForClass(Comment);

export default CommentModel;
