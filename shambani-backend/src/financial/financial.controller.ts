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
import { FinancialService } from './financial.service';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('financial')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('records')
  createFinancialRecord(@Request() req, @Body() createFinancialRecordDto: CreateFinancialRecordDto) {
    return this.financialService.createFinancialRecord(req.user.userId, createFinancialRecordDto);
  }

  @Get('records')
  getFinancialRecords(
    @Request() req,
    @Query('farmId') farmId?: string,
    @Query('recordType') recordType?: string,
    @Query('category') category?: string,
  ) {
    return this.financialService.getFinancialRecords(req.user.userId, farmId, recordType, category);
  }

  @Get('records/:id')
  getFinancialRecord(@Param('id') id: string, @Request() req) {
    return this.financialService.getFinancialRecord(id, req.user.userId);
  }

  @Patch('records/:id')
  updateFinancialRecord(
    @Param('id') id: string,
    @Request() req,
    @Body() updateFinancialRecordDto: UpdateFinancialRecordDto,
  ) {
    return this.financialService.updateFinancialRecord(id, req.user.userId, updateFinancialRecordDto);
  }

  @Delete('records/:id')
  deleteFinancialRecord(@Param('id') id: string, @Request() req) {
    return this.financialService.deleteFinancialRecord(id, req.user.userId);
  }

  @Get('summary')
  getFinancialSummary(@Request() req, @Query('period') period?: string) {
    return this.financialService.getFinancialSummary(req.user.userId, period);
  }

  @Get('profit-loss')
  getProfitLossStatement(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.financialService.getProfitLossStatement(req.user.userId, start, end);
  }

  @Post('loans')
  createLoanRequest(@Request() req, @Body() createLoanRequestDto: CreateLoanRequestDto) {
    return this.financialService.createLoanRequest(req.user.userId, createLoanRequestDto);
  }

  @Get('loans')
  getLoanRequests(@Request() req) {
    return this.financialService.getLoanRequests(req.user.userId);
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN')
  getAllFinancialStats(@Query('period') period?: string) {
    return this.financialService.getAllFinancialStats(period);
  }

  @Get('admin/loans')
  @Roles('SUPER_ADMIN')
  getAllLoanRequests() {
    return this.financialService.getAllLoanRequests();
  }
}
