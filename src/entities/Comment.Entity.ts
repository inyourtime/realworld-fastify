import { ModelOptions, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user.entity';

@ModelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class Comment extends TimeStamps {
  @prop()
  public body!: string;

  @prop({ ref: () => User })
  public author!: Ref<User>;
}
