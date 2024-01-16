import { User } from '../../entities/user.entity';

export type TBaseUserResp = Pick<User, 'email' | 'username' | 'bio' | 'image'>;
export interface IUserResp extends TBaseUserResp {
  token?: string;
}

export type TUserProfileResp = Pick<User, 'username' | 'bio' | 'image'>;
export interface IUserProfileResp extends TUserProfileResp {
  following: boolean;
}
