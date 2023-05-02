import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
    });
  }

  validate(accssToken, refreshToken, profile) {
    console.log(profile);
    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      hashedPassword: '1234',
      age: 0,
      birth: '1998-02-09',
    };
  }
}
