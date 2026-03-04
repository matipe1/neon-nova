import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({
      adapter,
      // log: [{ emit: 'stdout', level: 'query' }]
    });
  }
  async onModuleDestroy() {
    await this.$connect();
  }
  async onModuleInit() {
    await this.$disconnect();
  }
}
