import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class PoultryModule {}
