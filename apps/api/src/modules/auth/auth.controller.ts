import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import type { AuthJwtPayload } from './types/auth-jwtPayload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Body() AuthJwtPayload: AuthJwtPayload) {
    return this.authService.refreshToken(AuthJwtPayload);
  }
}
