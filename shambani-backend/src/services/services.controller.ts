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
import { ServicesService } from './services.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('requests')
  createServiceRequest(@Request() req, @Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.servicesService.createServiceRequest(req.user.userId, createServiceRequestDto);
  }

  @Get('requests')
  getServiceRequests(
    @Request() req,
    @Query('serviceType') serviceType?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('region') region?: string,
    @Query('district') district?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.servicesService.getServiceRequests(req.user.userId, serviceType, status, priority, region, district, start, end);
  }

  @Get('requests/:id')
  getServiceRequest(@Param('id') id: string, @Request() req) {
    return this.servicesService.getServiceRequest(id, req.user.userId);
  }

  @Get('assignments')
  getServiceAssignments(
    @Request() req,
    @Query('serviceRequestId') serviceRequestId?: string
  ) {
    return this.servicesService.getServiceAssignments(serviceRequestId, req.user);
  }

  @Get('extension-officers/:extensionOfficerId/stats')
  getExtensionOfficerStats(
    @Param('extensionOfficerId') extensionOfficerId: string,
    @Request() req
  ) {
    return this.servicesService.getExtensionOfficerStats(extensionOfficerId, req.user);
  }

  @Patch('requests/:id/complete')
  completeServiceRequest(
    @Param('id') id: string,
    @Request() req,
    @Body() input: any
  ) {
    return this.servicesService.completeServiceRequest(id, req.user.userId, input);
  }

  @Patch('requests/:id')
  updateServiceRequest(
    @Param('id') id: string,
    @Request() req,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto,
  ) {
    return this.servicesService.updateServiceRequest(id, req.user.userId, updateServiceRequestDto);
  }

  @Delete('requests/:id')
  deleteServiceRequest(@Param('id') id: string, @Request() req) {
    return this.servicesService.deleteServiceRequest(id, req.user.userId);
  }

  @Patch('requests/:id/rate')
  rateService(
    @Param('id') id: string,
    @Request() req,
    @Body() input: { rating: number; feedback?: string }
  ) {
    return this.servicesService.rateService(id, req.user.userId, input);
  }

  @Get('stats')
  getServiceStats(
    @Request() req, 
    @Query('period') period?: string,
    @Query('region') region?: string,
    @Query('district') district?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.servicesService.getServiceStats(req.user.userId, region, district, start, end);
  }

  // Extension Officer endpoints
  @Get('assigned')
  @Roles('EXTENSION_OFFICER', 'SUPER_ADMIN')
  getAssignedServices(
    @Request() req,
    @Query('status') status?: string
  ) {
    return this.servicesService.getAssignedServices(req.user.userId, status);
  }

  @Patch('requests/:id/status')
  @Roles('EXTENSION_OFFICER', 'SUPER_ADMIN')
  updateServiceStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() input: { status: string; notes?: string }
  ) {
    return this.servicesService.updateServiceStatus(id, req.user.userId, input.status, input.notes);
  }

  // Admin endpoints
  @Get('admin/stats')
  @Roles('SUPER_ADMIN')
  getAllServiceStats(
    @Query('region') region?: string,
    @Query('district') district?: string
  ) {
    return this.servicesService.getAllServiceStats(region, district);
  }

  @Get('admin/requests')
  @Roles('SUPER_ADMIN')
  getAllServiceRequests() {
    return this.servicesService.getAllServiceRequests();
  }

  @Patch('admin/requests/:id/assign')
  @Roles('SUPER_ADMIN')
  assignServiceRequest(
    @Param('id') id: string, 
    @Body() input: { assignedTo: string; notes?: string }
  ) {
    return this.servicesService.assignServiceRequest(id, input.assignedTo, input);
  }
}
