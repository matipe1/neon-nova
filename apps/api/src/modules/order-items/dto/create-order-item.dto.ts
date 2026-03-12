import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productId!: string;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity!: number;
}
