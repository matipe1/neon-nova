import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del tag es obligatorio' })
  @MinLength(3, { message: 'El nombre es demasiado corto' })
  @MaxLength(25)
  name!: string;
}
