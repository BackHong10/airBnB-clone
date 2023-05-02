import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'],
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
