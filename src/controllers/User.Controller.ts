import UserModel from '../entities/user.entity';
import { TUserCreateSchema, TUserLoginSchema } from '../schemas/user.schema';
import UserService from '../services/user.service';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import { IUserResp } from '../declarations/interfaces/user.interface';
import ApiError from '../internal/fastify/responseHandler/apiError';
import { STATUS_CODE } from '../internal/fastify/responseHandler/statusCode';

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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
        user: user.toUserResponse(),
      };
    } catch (e: any) {
      if (e.code === 11000) {
        throw ApiError.createError(
          'Email or username are already exist',
          STATUS_CODE.UNPROCESSABLE_CONTENT,
        );
      }
      throw e;
    }
  }

  public async login({
    email,
    password,
  }: TUserLoginSchema): Promise<{ user: IUserResp }> {
    const loginError = ApiError.createError(
      'Email or password are incorrect',
      STATUS_CODE.UNAUTHORIZED,
    );

    const user = await UserModel.findOne(
      { email },
      { email: 1, username: 1, bio: 1, image: 1, password: 1 },
    ).exec();
    if (!user) {
      throw loginError;
    }

    const match = await checkPassword(user.password, password);
    if (!match) {
      throw loginError;
    }
    return {
      user: user.toUserResponse(),
    };
  }

  public async getCurrentUser() {}
}
