import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { retryWhen } from 'rxjs';
import { IAuthUserItem } from 'src/commons/types/context';
import { User } from '../user/entities/user.entity';
import { IAuthServiceSetRefreshToken } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );

    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    // res.setHeader('Set-Cookie', `refreshToken= ${refreshToken}`);
  }
  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }
}
