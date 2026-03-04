import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Tag } from '../../generated/prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    return this.prisma.tag.upsert({
      create: { name: createTagDto.name },
      update: {},
      where: { name: createTagDto.name },
    });
  }

  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string): Promise<Tag> {
    try {
      return await this.prisma.tag.findUniqueOrThrow({ where: { id } });
    } catch {
      // Prisma error code: P2025
      throw new NotFoundException(`Tag with ID ${id} was not found`);
    }
  }

  async remove(id: string): Promise<Tag> {
    await this.findOne(id);
    return this.prisma.tag.delete({ where: { id } });
  }
}
