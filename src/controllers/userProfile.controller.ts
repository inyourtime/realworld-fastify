import errors from '../constants/errors';
import { IAnyObject } from '../declarations/interfaces/base.interface';
import { IUserProfileResp } from '../declarations/interfaces/user.interface';
import UserModel from '../entities/user.entity';
import BaseController from './base.controller';

export default class UserProfileController extends BaseController {
  constructor(auth?: IAnyObject) {
    super(auth);
  }

  public async getProfile(
    username: string,
  ): Promise<{ profile: IUserProfileResp }> {
    const targetProfile = await UserModel.findOne({ username }).exec();
    if (!targetProfile) {
      throw errors.PROFILE_NOTFOUND;
    }

    return this.auth
      ? await UserModel.findOne({
          email: this.auth.user.email,
        })
          .exec()
          .then((loginUser) => {
            if (!loginUser) throw errors.PROFILE_NOTFOUND;
            return {
              profile: targetProfile.toProfileJSON(loginUser),
            };
          })
      : {
          profile: targetProfile.toProfileJSON(),
        };
  }

  public async followUser(
    username: string,
  ): Promise<{ profile: IUserProfileResp }> {
    const loginUser = await UserModel.findOne({
      email: this.auth!.user.email,
    }).exec();
    const targetUser = await UserModel.findOne({ username }).exec();

    if (!loginUser || !targetUser) {
      throw errors.USER_NOTFOUND;
    }

    if (!loginUser.followings?.includes(targetUser._id)) {
      loginUser.followings?.push(targetUser);
      targetUser.followers?.push(loginUser);
    }

    const [, user] = await Promise.all([loginUser.save(), targetUser.save()]);

    return {
      profile: user.toProfileJSON(loginUser),
    };
  }
}
