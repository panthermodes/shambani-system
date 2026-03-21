import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateProductionRecordDto } from './dto/create-production-record.dto';
import { UpdateProductionRecordDto } from './dto/update-production-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('production')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post('records')
  createProductionRecord(@Request() req, @Body() createProductionRecordDto: CreateProductionRecordDto) {
    return this.productionService.createProductionRecord(req.user.userId, createProductionRecordDto);
  }

  @Get('records')
  getProductionRecords(
    @Request() req,
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
    @Query('recordType') recordType?: string,
  ) {
    return this.productionService.getProductionRecords(req.user.userId, farmId, houseId, recordType);
  }

  @Get('records/:id')
  getProductionRecord(@Param('id') id: string, @Request() req) {
    return this.productionService.getProductionRecord(id, req.user.userId);
  }

  @Patch('records/:id')
  updateProductionRecord(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProductionRecordDto: UpdateProductionRecordDto,
  ) {
    return this.productionService.updateProductionRecord(id, req.user.userId, updateProductionRecordDto);
  }

  @Delete('records/:id')
  deleteProductionRecord(@Param('id') id: string, @Request() req) {
    return this.productionService.deleteProductionRecord(id, req.user.userId);
  }

  @Get('eggs/stats')
  getEggProductionStats(
    @Request() req, 
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.productionService.getEggProduction(req.user.userId, farmId, houseId, start, end);
  }

  @Get('chicks/stats')
  getChickHatchingStats(
    @Request() req, 
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.productionService.getChickHatching(req.user.userId, farmId, houseId, start, end);
  }

  @Get('mortality/stats')
  getMortalityStats(
    @Request() req, 
    @Query('period') period?: string
  ) {
    return this.productionService.getMortalityStats(req.user.userId, period);
  }

  @Get('weight/stats')
  getWeightGainStats(
    @Request() req, 
    @Query('period') period?: string
  ) {
    return this.productionService.getWeightGainStats(req.user.userId, period);
  }

  @Get('stats')
  getProductionStats(
    @Request() req, 
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.productionService.getProductionStats(req.user.userId, farmId, houseId, start, end);
  }

  @Get('dashboard')
  getProductionDashboard(@Request() req, @Query('period') period?: string) {
    return this.productionService.getProductionDashboard(req.user.userId, period);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  getAllProductionStats(@Query('period') period?: string) {
    return this.productionService.getAllProductionStats(period);
  }
}
