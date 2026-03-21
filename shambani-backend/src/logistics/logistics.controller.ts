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
import { LogisticsService } from './logistics.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';
import { UpdateLogisticsDto } from './dto/update-logistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('logistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post()
  createLogistics(@Request() req, @Body() createLogisticsDto: CreateLogisticsDto) {
    return this.logisticsService.createLogistics(req.user.userId, createLogisticsDto);
  }

  @Get()
  getLogistics(@Request() req, @Query('status') status?: string) {
    return this.logisticsService.getLogistics(req.user.userId, status);
  }

  @Get('available')
  getAvailableJobs() {
    return this.logisticsService.getAvailableJobs();
  }

  @Post('accept/:orderId')
  acceptDeliveryJob(
    @Param('orderId') orderId: string,
    @Request() req,
    @Body('estimatedDelivery') estimatedDelivery?: string,
  ) {
    const estimated = estimatedDelivery ? new Date(estimatedDelivery) : undefined;
    return this.logisticsService.acceptDeliveryJob(req.user.userId, orderId, estimated);
  }

  @Get(':id')
  getLogisticsRecord(@Param('id') id: string, @Request() req) {
    return this.logisticsService.getLogisticsRecord(id, req.user.userId);
  }

  @Patch(':id')
  updateLogistics(@Param('id') id: string, @Request() req, @Body() updateLogisticsDto: UpdateLogisticsDto) {
    return this.logisticsService.updateLogistics(id, req.user.userId, updateLogisticsDto);
  }

  @Patch(':id/status')
  updateDeliveryStatus(
    @Param('id') id: string,
    @Request() req,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.logisticsService.updateDeliveryStatus(id, req.user.userId, status, notes);
  }

  // Admin endpoints
  @Get('admin/all')
  @Roles('SUPER_ADMIN')
  getAllLogistics(@Query('status') status?: string) {
    return this.logisticsService.getAllLogistics(status);
  }

  @Patch('admin/:id/status')
  @Roles('SUPER_ADMIN')
  updateLogisticsStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.logisticsService.updateLogisticsStatus(id, status, notes);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN')
  getLogisticsStats() {
    return this.logisticsService.getLogisticsStats();
  }
}
