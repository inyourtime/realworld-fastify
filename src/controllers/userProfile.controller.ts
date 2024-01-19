import errors from '../constants/errors';
import { IAnyObject } from '../declarations/interfaces/base.interface';
import { IUserProfileResp } from '../declarations/interfaces/user.interface';

import BaseController from './base.controller';
import { UserModel } from '../entities';

export default class UserProfileController extends BaseController {
  constructor(auth?: IAnyObject) {
    super(auth);
  }

  public async getProfile(username: string): Promise<{ profile: IUserProfileResp }> {
    const targetProfile = await UserModel.findOne({ username }).exec();
    if (!targetProfile) {
      throw errors.PROFILE_NOTFOUND;
    }

    return this.auth
      ? UserModel.findOne({
          email: this.getUserEmail(),
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

  public async followUser(username: string): Promise<{ profile: IUserProfileResp }> {
    const [loginUser, targetUser] = await Promise.all([
      UserModel.findOne({ email: this.getUserEmail() }).exec(),
      UserModel.findOne({ username }).exec(),
    ]);

    if (!loginUser || !targetUser) {
      throw errors.USER_NOTFOUND;
    }

    await loginUser.follow(targetUser);

    return {
      profile: targetUser.toProfileJSON(loginUser),
    };
  }

  public async unFollowUser(username: string): Promise<{ profile: IUserProfileResp }> {
    const [loginUser, targetUser] = await Promise.all([
      UserModel.findOne({ email: this.getUserEmail() }).exec(),
      UserModel.findOne({ username }).exec(),
    ]);

    if (!loginUser || !targetUser) {
      throw errors.USER_NOTFOUND;
    }

    await loginUser.unFollow(targetUser);

    return {
      profile: targetUser.toProfileJSON(loginUser),
    };
  }
}
