import { Expose, Transform, Type } from 'class-transformer';
import { OrderStatus } from '../../../generated/prisma/enums';
import { OrderItemResponseDto } from '../../order-items/dto/order-item-response.dto';

export class OrderResponseDto {
  @Expose()
  id!: string;

  @Expose()
  status!: OrderStatus;

  @Expose()
  @Transform(({ value }) => Number(value))
  totalEarnings!: number;

  @Expose()
  customerName?: string;

  @Expose()
  customerPhone?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  @Type(() => OrderItemResponseDto)
  items!: OrderItemResponseDto[];
}
