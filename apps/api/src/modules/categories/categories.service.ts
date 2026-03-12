import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.prisma.category.create({ data: dto });
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    try {
      return await this.prisma.category.findUniqueOrThrow({
        where: { id },
        include: { _count: { select: { products: true } } },
      });
    } catch {
      throw new NotFoundException(`Category with ID ${id} was not found`);
    }
  }

  async update(
    id: string,
    updatedDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: updatedDto,
    });
  }

  async remove(id: string): Promise<CategoryResponseDto> {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
