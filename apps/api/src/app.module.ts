import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TagsModule } from './modules/tags/tags.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [PrismaModule, TagsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
