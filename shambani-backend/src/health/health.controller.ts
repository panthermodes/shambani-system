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
import { HealthService } from './health.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('health')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('records')
  createHealthRecord(@Request() req, @Body() createHealthRecordDto: CreateHealthRecordDto) {
    return this.healthService.createHealthRecord(req.user.userId, createHealthRecordDto);
  }

  @Get('records')
  getHealthRecords(
    @Request() req,
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
    @Query('recordType') recordType?: string,
  ) {
    return this.healthService.getHealthRecords(req.user.userId, farmId, houseId, recordType);
  }

  @Get('records/:id')
  getHealthRecord(@Param('id') id: string, @Request() req) {
    return this.healthService.getHealthRecord(id, req.user.userId);
  }

  @Patch('records/:id')
  updateHealthRecord(
    @Param('id') id: string,
    @Request() req,
    @Body() updateHealthRecordDto: UpdateHealthRecordDto,
  ) {
    return this.healthService.updateHealthRecord(id, req.user.userId, updateHealthRecordDto);
  }

  @Delete('records/:id')
  deleteHealthRecord(@Param('id') id: string, @Request() req) {
    return this.healthService.deleteHealthRecord(id, req.user.userId);
  }

  @Get('vaccinations')
  getVaccinationSchedule(@Query('chickenType') chickenType: string, @Query('ageInWeeks') ageInWeeks: number) {
    return this.healthService.getVaccinationSchedule(chickenType, ageInWeeks);
  }

  @Get('diseases')
  getDiseaseOutbreaks(@Request() req) {
    return this.healthService.getDiseaseOutbreaks(req.user.userId);
  }

  @Get('stats')
  getHealthStats(@Request() req, @Query('period') period?: string) {
    return this.healthService.getHealthStats(req.user.userId, period);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  getAllHealthStats(@Query('period') period?: string) {
    return this.healthService.getAllHealthStats(period);
  }

  @Get('admin/diseases')
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  getAllDiseaseOutbreaks() {
    return this.healthService.getAllDiseaseOutbreaks();
  }
}
