import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
    });
  }

  validate(accssToken, refreshToken, profile) {
    console.log(profile._json.kakao_account.email);
    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      hashedPassword: '1234',
      age: 0,
      birth: '1998-02-09',
    };
  }
}
