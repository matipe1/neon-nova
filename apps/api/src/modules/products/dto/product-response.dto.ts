import { Expose, Transform, Type } from 'class-transformer';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { TagResponseDto } from '../../tags/dto/tag-response.dto';

export class ProductResponseDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() description!: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  price!: number;

  @Expose() stock!: number;
  @Expose() imageUrl?: string;
  @Expose() categoryId?: string;

  @Expose()
  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto;

  @Expose()
  @Type(() => TagResponseDto)
  tags?: TagResponseDto[];
}
