import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

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

    return {
      ...payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
