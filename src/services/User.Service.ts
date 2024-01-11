import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import UserModel, { User } from '../entities/user.entity';

export default class UserService {
  private _model: ReturnModelType<typeof User, BeAnObject>;

  constructor() {
    this._model = UserModel;
  }

  public findAll() {
    return this._model.find().populate('followers').lean().exec()
  }
}
