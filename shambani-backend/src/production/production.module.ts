import { Module } from '@nestjs/common';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { ProductionResolver } from './production.resolver';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductionController],
  providers: [ProductionService, ProductionResolver],
  exports: [ProductionService],
})
export class ProductionModule {}
