import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';

import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { randomUUID } from 'crypto';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class User extends TimeStamps {
  @prop({ required: true, default: () => randomUUID() })
  public _id!: string;

  @prop({ unique: true, required: true, index: true })
  public email!: string;

  @prop({ unique: true, required: true, index: true })
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
}

const UserModel = getModelForClass(User);

export default UserModel;
