import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthJwtPayload } from '../types/auth-jwtPayload';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_JWT_SECRET || '',
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    return payload;
  }
}
