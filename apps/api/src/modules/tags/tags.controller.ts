import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() dto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagsService.create(dto);
  }

  @Get()
  findAll(): Promise<TagResponseDto[]> {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TagResponseDto> {
    return this.tagsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<TagResponseDto> {
    return this.tagsService.remove(id);
  }
}
