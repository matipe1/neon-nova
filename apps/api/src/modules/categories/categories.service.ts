import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from '../../generated/prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string): Promise<Category> {
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
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string): Promise<Category> {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
