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
import { FeedingService } from './feeding.service';
import { CreateFeedingRecordDto } from './dto/create-feeding-record.dto';
import { UpdateFeedingRecordDto } from './dto/update-feeding-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('feeding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedingController {
  constructor(private readonly feedingService: FeedingService) {}

  @Post('records')
  createFeedingRecord(@Request() req, @Body() createFeedingRecordDto: CreateFeedingRecordDto) {
    return this.feedingService.createFeedingRecord(req.user.userId, createFeedingRecordDto);
  }

  @Get('records')
  getFeedingRecords(
    @Request() req,
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
  ) {
    return this.feedingService.getFeedingRecords(req.user.userId, farmId, houseId);
  }

  @Get('records/:id')
  getFeedingRecord(@Param('id') id: string, @Request() req) {
    return this.feedingService.getFeedingRecord(id, req.user.userId);
  }

  @Patch('records/:id')
  updateFeedingRecord(
    @Param('id') id: string,
    @Request() req,
    @Body() updateFeedingRecordDto: UpdateFeedingRecordDto,
  ) {
    return this.feedingService.updateFeedingRecord(id, req.user.userId, updateFeedingRecordDto);
  }

  @Delete('records/:id')
  deleteFeedingRecord(@Param('id') id: string, @Request() req) {
    return this.feedingService.deleteFeedingRecord(id, req.user.userId);
  }

  @Get('stats')
  getFeedingStats(
    @Request() req,
    @Query('farmId') farmId?: string,
    @Query('houseId') houseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.feedingService.getFeedingStats(req.user.userId, farmId, houseId, start, end, period);
  }

  @Get('schedule')
  getFeedingSchedule(@Request() req) {
    return this.feedingService.getFeedingSchedule(req.user.userId);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  getAllFeedingStats(
    @Query('region') region?: string,
    @Query('district') district?: string,
    @Query('period') period?: string
  ) {
    return this.feedingService.getAllFeedingStats(region, district, period);
  }
}
