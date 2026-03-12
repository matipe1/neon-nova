import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short (min 8 characters)' })
  @IsNotEmpty()
  password!: string;

  @IsString()
  @MinLength(3, { message: 'Name is too short (min 3 characters)' })
  @IsNotEmpty()
  name!: string;
}
