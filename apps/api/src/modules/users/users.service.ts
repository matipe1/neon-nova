import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findForAuth(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new NotFoundException(`User with id ${email} doesn't exist`);
    return user;
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User with id ${id} doesn't exist`);

    // eslint-disable-next-line
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new NotFoundException(`User with email ${email} doesn't exist`);

    // eslint-disable-next-line
    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        },
      });

      // eslint-disable-next-line
      const { password, ...result } = newUser;

      return result;
    } catch {
      throw new InternalServerErrorException('User creation error');
    }
  }
}
