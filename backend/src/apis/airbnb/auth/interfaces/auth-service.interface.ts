import { Response } from 'express';
import { User } from 'src/apis/airbnb/user/entities/user.entity';
import { IAuthUserItem } from 'src/commons/types/context';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUserItem;
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}
