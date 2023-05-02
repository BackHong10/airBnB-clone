import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../user/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
    private readonly usersService: UsersService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    const user = await this.usersService.find({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면 에러던지기
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    this.authService.setRefreshToken({ user, res: context.res });

    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authService.getAccessToken({ user: context.req.user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: IContext, //
  ) {
    const refresh_token = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    const access_token = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    console.log(refresh_token);

    try {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_KEY);
      const decodedR = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY);
      const expireTime = Math.floor(decoded['exp'] - decoded['iat']);
      const expireTimeRefresh = Math.floor(decodedR['exp'] - decodedR['iat']);
      console.log(expireTime, expireTimeRefresh);
      await this.cacheManager.set(
        `access_token:${access_token}`,
        'accessToken',
        expireTime,
      );

      await this.cacheManager.set(
        `refresh_token:${refresh_token}`,
        'refreshToken',
        expireTimeRefresh,
      );
      console.log(typeof expireTime, typeof expireTimeRefresh);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return '로그아웃에 성공하였습니다.';
  }
}
