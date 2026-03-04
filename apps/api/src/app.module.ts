import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TagsModule } from './modules/tags/tags.module';

@Module({
  imports: [PrismaModule, TagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
