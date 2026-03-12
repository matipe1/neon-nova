import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { AuthJwtPayload } from './types/auth-jwtPayload';
import { SignInDto } from './dto/sign-in.dto';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.usersService.findForAuth(email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPassMatch = await compare(pass, user.password);
      if (!isPassMatch) throw new UnauthorizedException('Invalid credentials');

      // eslint-disable-next-line
      const { password, ...result } = user;

      return result;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);

    const payload: AuthJwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshTokenConfig,
    );

    return {
      ...payload,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(authJwtPayload: AuthJwtPayload) {
    const payload: AuthJwtPayload = authJwtPayload;

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      ...payload,
      accessToken,
    };
  }
}
