import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { User } from '../../generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.create(createUserDto);
  }

  @Get(':email')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Param('email') email: string,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.getUserProfileByEmail(email);
  }
}
