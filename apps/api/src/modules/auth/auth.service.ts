import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
