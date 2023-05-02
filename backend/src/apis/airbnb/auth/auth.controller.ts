import { All, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../user/users.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
    picture: string;
    hashedPassword: string;
    age: number;
    birth: Date;
  };
}
@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService, //
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    let user = await this.usersService.find({ email: req.user.email });
    if (!user) {
      user = await this.usersService.create({
        ...req.user,
      });
    }

    this.authService.setRefreshToken({ user, res });
    res.redirect('http://localhost:5500/frontend/login/index.html');
  }

  @UseGuards(AuthGuard('naver'))
  @Get('/login/naver')
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    let user = await this.usersService.find({ email: req.user.email });
    if (!user) {
      user = await this.usersService.create({
        ...req.user,
      });
    }
    this.authService.setRefreshToken({ user, res });
    res.redirect('http://localhost:5500/frontend/login/index.html');
  }

  @UseGuards(AuthGuard('kakao'))
  @Get('/login/kakao')
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    let user = await this.usersService.find({ email: req.user.email });
    if (!user) {
      user = await this.usersService.create({
        ...req.user,
      });
    }
    this.authService.setRefreshToken({ user, res });
    res.redirect('http://localhost:5500/frontend/login/index.html');
  }
}
