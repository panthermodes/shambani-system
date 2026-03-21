import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ServicesService } from '../services/services.service';
import { CreateServiceRequestDto } from '../services/dto/create-service-request.dto';
import { UpdateServiceRequestDto } from '../services/dto/update-service-request.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Query(() => [Object], { name: 'getServiceRequests' })
  @UseGuards(GqlAuthGuard)
  async getServiceRequests(
    @Args('serviceType', { nullable: true }) serviceType: string,
    @Args('status', { nullable: true }) status: string,
    @Args('priority', { nullable: true }) priority: string,
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.getServiceRequests(userId, serviceType, status, priority, region, district, startDate, endDate);
  }

  @Query(() => Object, { name: 'getServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async getServiceRequest(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.servicesService.getServiceRequest(id, userId);
  }

  @Query(() => [Object], { name: 'getAssignedServices' })
  @UseGuards(GqlAuthGuard)
  async getAssignedServices(
    @Args('status', { nullable: true }) status: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.getAssignedServices(userId, status);
  }

  @Query(() => [Object], { name: 'getServiceAssignments' })
  @UseGuards(GqlAuthGuard)
  async getServiceAssignments(@Args('serviceRequestId') serviceRequestId: string, @Context() context) {
    const currentUser = context.req.user;
    return this.servicesService.getServiceAssignments(serviceRequestId, currentUser);
  }

  @Query(() => [Object], { name: 'getServiceRatings' })
  @UseGuards(GqlAuthGuard)
  async getServiceRatings(
    @Args('extensionOfficerId', { nullable: true }) extensionOfficerId: string,
    @Context() context
  ) {
    const currentUser = context.req.user;
    return this.servicesService.getServiceRatings(extensionOfficerId, currentUser);
  }

  @Query(() => Object, { name: 'getServiceStats' })
  @UseGuards(GqlAuthGuard)
  async getServiceStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.getServiceStats(userId, region, district, startDate, endDate);
  }

  @Query(() => Object, { name: 'getAdminServiceStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdminServiceStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string
  ) {
    return this.servicesService.getAllServiceStats(region, district);
  }

  @Query(() => Object, { name: 'getExtensionOfficerStats' })
  @UseGuards(GqlAuthGuard)
  async getExtensionOfficerStats(
    @Args('extensionOfficerId', { nullable: true }) extensionOfficerId: string,
    @Context() context
  ) {
    const currentUser = context.req.user;
    return this.servicesService.getExtensionOfficerStats(extensionOfficerId, currentUser);
  }

  @Query(() => [Object], { name: 'getAvailableExtensionOfficers' })
  @UseGuards(GqlAuthGuard)
  async getAvailableExtensionOfficers(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string
  ) {
    return this.servicesService.getAvailableExtensionOfficers(region, district);
  }

  @Query(() => [Object], { name: 'getServiceHistory' })
  @UseGuards(GqlAuthGuard)
  async getServiceHistory(
    @Args('userId', { nullable: true }) userId: string,
    @Args('serviceType', { nullable: true }) serviceType: string,
    @Context() context
  ) {
    const currentUser = context.req.user;
    const targetUserId = userId || currentUser.id;
    return this.servicesService.getServiceHistory(targetUserId, serviceType, currentUser);
  }

  @Query(() => [Object], { name: 'getPendingServiceRequests' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getPendingServiceRequests() {
    return this.servicesService.getPendingServiceRequests();
  }

  @Query(() => Object, { name: 'getServicePerformanceMetrics' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getServicePerformanceMetrics(
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date
  ) {
    return this.servicesService.getServicePerformanceMetrics(startDate, endDate);
  }

  @Mutation(() => Object, { name: 'createServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async createServiceRequest(
    @Args('input') input: CreateServiceRequestDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.createServiceRequest(userId, input);
  }

  @Mutation(() => Object, { name: 'updateServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async updateServiceRequest(
    @Args('id') id: string,
    @Args('input') input: UpdateServiceRequestDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.updateServiceRequest(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async deleteServiceRequest(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.servicesService.deleteServiceRequest(id, userId);
  }

  @Mutation(() => Object, { name: 'assignServiceRequest' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async assignServiceRequest(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('extensionOfficerId') extensionOfficerId: string,
    @Args('input', { nullable: true }) input?: { notes?: string }
  ) {
    return this.servicesService.assignServiceRequest(serviceRequestId, extensionOfficerId, input);
  }

  @Mutation(() => Object, { name: 'acceptServiceAssignment' })
  @UseGuards(GqlAuthGuard)
  async acceptServiceAssignment(
    @Args('serviceRequestId') serviceRequestId: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.acceptServiceAssignment(serviceRequestId, userId);
  }

  @Mutation(() => Object, { name: 'rejectServiceAssignment' })
  @UseGuards(GqlAuthGuard)
  async rejectServiceAssignment(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('reason') reason: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.rejectServiceAssignment(serviceRequestId, userId, reason);
  }

  @Mutation(() => Object, { name: 'updateServiceStatus' })
  @UseGuards(GqlAuthGuard)
  async updateServiceStatus(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('status') status: string,
    @Args('notes') notes: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.updateServiceStatus(serviceRequestId, userId, status, notes);
  }

  @Mutation(() => Object, { name: 'completeServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async completeServiceRequest(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.completeServiceRequest(serviceRequestId, userId, input);
  }

  @Mutation(() => Object, { name: 'rateService' })
  @UseGuards(GqlAuthGuard)
  async rateService(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('input') input: { rating: number; feedback?: string },
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.rateService(serviceRequestId, userId, input);
  }

  @Mutation(() => Object, { name: 'cancelServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async cancelServiceRequest(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('reason') reason: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.cancelServiceRequest(serviceRequestId, userId, reason);
  }

  @Mutation(() => Object, { name: 'rescheduleServiceRequest' })
  @UseGuards(GqlAuthGuard)
  async rescheduleServiceRequest(
    @Args('serviceRequestId') serviceRequestId: string,
    @Args('newDate') newDate: Date,
    @Args('reason') reason: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.servicesService.rescheduleServiceRequest(serviceRequestId, userId, newDate, reason);
  }
}
