import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del tag es obligatorio' })
  @MinLength(3, { message: 'El nombre es demasiado corto' })
  @MaxLength(20)
  name!: string;
}
