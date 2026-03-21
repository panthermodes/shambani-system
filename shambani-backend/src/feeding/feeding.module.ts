import { Module } from '@nestjs/common';
import { FeedingController } from './feeding.controller';
import { FeedingService } from './feeding.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeedingController],
  providers: [FeedingService],
  exports: [FeedingService],
})
export class FeedingModule {}
