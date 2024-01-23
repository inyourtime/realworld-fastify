import { TUserCreateSchema, TUserLoginSchema, TUserUpdateSchema } from '../schemas/user.schema';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import { IUserResp } from '../declarations/interfaces/user.interface';
import BaseController from './base.controller';
import { IAnyObject } from '../declarations/interfaces/base.interface';
import errors from '../constants/errors';
import { UserModel } from '../entities';
import S3Service from '../internal/s3';

export default class UserController extends BaseController {
  constructor(auth?: IAnyObject) {
    super(auth);
  }

  public async register({
    username,
    email,
    password,
  }: TUserCreateSchema): Promise<{ user: IUserResp }> {
    const hash = await hashPassword(password);

    try {
      const user = await UserModel.create({
        email,
        username,
        password: hash,
      });

      return {
        user: await user.toUserJSON(),
      };
    } catch (e: any) {
      if (e.code === 11000) {
        throw errors.USER_EXIST;
      }
      throw e;
    }
  }

  public async login({ email, password }: TUserLoginSchema): Promise<{ user: IUserResp }> {
    const user = await UserModel.findOne(
      { email },
      { email: 1, username: 1, bio: 1, image: 1, password: 1 },
    ).exec();
    if (!user) {
      throw errors.LOGIN_ERROR;
    }

    const match = await checkPassword(user.password, password);
    if (!match) {
      throw errors.LOGIN_ERROR;
    }
    return {
      user: await user.toUserJSON(),
    };
  }

  public async getCurrentUser(): Promise<{ user: IUserResp }> {
    const user = await UserModel.findOne({
      email: this.getUserEmail(),
    }).exec();
    if (!user) {
      throw errors.USER_NOTFOUND;
    }

    return {
      user: {
        ...(await user.toUserJSON()),
        token: undefined,
      },
    };
  }

  public async updateUser({ user, image }: TUserUpdateSchema): Promise<{ user: IUserResp }> {
    const { email, username, password, bio } = user;

    const target = await UserModel.findOne({
      email: this.getUserEmail(),
    }).exec();
    if (!target) {
      throw errors.USER_NOTFOUND;
    }

    if (email) {
      target.email = email;
    }
    if (username) {
      target.username = username;
    }
    if (password) {
      target.password = await hashPassword(password);
    }
    if (bio) {
      target.bio = bio;
    }

    if (image) {
      const uploadResult = await S3Service.uploadFile(image);
      target.image = uploadResult.Key;
    }

    try {
      const userUpdated = await target.save();
      return {
        user: {
          ...(await userUpdated.toUserJSON()),
          token: undefined,
        },
      };
    } catch (e: any) {
      if (e.code === 11000) {
        throw errors.USER_EXIST;
      }
      throw e;
    }
  }
}
