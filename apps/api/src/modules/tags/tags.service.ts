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
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!tag) throw new NotFoundException(`Tag #${id} not found`);
    return tag;
  }

  async remove(id: string): Promise<Tag> {
    await this.findOne(id);
    return this.prisma.tag.delete({ where: { id } });
  }
}
