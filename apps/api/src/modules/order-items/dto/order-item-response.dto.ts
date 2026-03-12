import { Expose, Transform } from 'class-transformer';

export class OrderItemResponseDto {
  @Expose()
  id!: string;

  @Expose()
  quantity!: number;

  @Expose()
  productId!: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  priceAtPurchase!: number;
}
