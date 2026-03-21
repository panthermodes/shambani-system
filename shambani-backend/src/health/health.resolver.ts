import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { HealthService } from '../health/health.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => [Object], { name: 'getHealthRecords' })
  @UseGuards(GqlAuthGuard)
  async getHealthRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('status', { nullable: true }) status: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.getHealthRecords(userId, farmId, houseId, status);
  }

  @Query(() => Object, { name: 'getHealthRecord' })
  @UseGuards(GqlAuthGuard)
  async getHealthRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.healthService.getHealthRecord(id, userId);
  }

  @Query(() => [Object], { name: 'getVaccinationRecords' })
  @UseGuards(GqlAuthGuard)
  async getVaccinationRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('status', { nullable: true }) status: string,
    @Args('upcoming', { nullable: true }) upcoming: boolean,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.getVaccinationRecords(userId, farmId, houseId, status, upcoming);
  }

  @Query(() => [Object], { name: 'getUpcomingVaccinations' })
  @UseGuards(GqlAuthGuard)
  async getUpcomingVaccinations(@Context() context) {
    const userId = context.req.user.id;
    return this.healthService.getUpcomingVaccinations(userId);
  }

  @Query(() => [Object], { name: 'getOverdueVaccinations' })
  @UseGuards(GqlAuthGuard)
  async getOverdueVaccinations(@Context() context) {
    const userId = context.req.user.id;
    return this.healthService.getOverdueVaccinations(userId);
  }

  @Query(() => [Object], { name: 'getDiseaseOutbreaks' })
  @UseGuards(GqlAuthGuard)
  async getDiseaseOutbreaks(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string,
    @Args('status', { nullable: true }) status: string,
    @Context() context
  ) {
    const currentUser = context.req.user;
    return this.healthService.getDiseaseOutbreaks(currentUser.id);
  }

  @Query(() => [Object], { name: 'getHealthAppointments' })
  @UseGuards(GqlAuthGuard)
  async getHealthAppointments(
    @Args('status', { nullable: true }) status: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.getHealthAppointments(userId, status, startDate, endDate);
  }

  @Query(() => [Object], { name: 'getUpcomingAppointments' })
  @UseGuards(GqlAuthGuard)
  async getUpcomingAppointments(@Context() context) {
    const userId = context.req.user.id;
    return this.healthService.getUpcomingAppointments(userId);
  }

  @Query(() => Object, { name: 'getHealthStats' })
  @UseGuards(GqlAuthGuard)
  async getHealthStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.getHealthStats(userId);
  }

  @Query(() => Object, { name: 'getAdminHealthStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdminHealthStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string
  ) {
    return this.healthService.getAdminHealthStats(region, district);
  }

  @Query(() => [Object], { name: 'getVaccinationSchedule' })
  @UseGuards(GqlAuthGuard)
  async getVaccinationSchedule(
    @Args('chickenType') chickenType: string,
    @Args('ageInWeeks') ageInWeeks: number
  ) {
    return this.healthService.getVaccinationSchedule(chickenType, ageInWeeks);
  }

  @Mutation(() => Object, { name: 'createHealthRecord' })
  @UseGuards(GqlAuthGuard)
  async createHealthRecord(
    @Args('input') input: CreateHealthRecordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.createHealthRecord(userId, input);
  }

  @Mutation(() => Object, { name: 'updateHealthRecord' })
  @UseGuards(GqlAuthGuard)
  async updateHealthRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateHealthRecordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.updateHealthRecord(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteHealthRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteHealthRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.healthService.deleteHealthRecord(id, userId);
  }

  @Mutation(() => Object, { name: 'createVaccinationRecord' })
  @UseGuards(GqlAuthGuard)
  async createVaccinationRecord(
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.createVaccinationRecord(userId, input);
  }

  @Mutation(() => Object, { name: 'updateVaccinationRecord' })
  @UseGuards(GqlAuthGuard)
  async updateVaccinationRecord(
    @Args('id') id: string,
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.updateVaccinationRecord(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteVaccinationRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteVaccinationRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.healthService.deleteVaccinationRecord(id, userId);
  }

  @Mutation(() => Object, { name: 'reportDiseaseOutbreak' })
  @UseGuards(GqlAuthGuard)
  async reportDiseaseOutbreak(@Args('input') input: any, @Context() context) {
    const currentUser = context.req.user;
    return this.healthService.reportDiseaseOutbreak(input, currentUser);
  }

  @Mutation(() => Object, { name: 'updateDiseaseOutbreak' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  async updateDiseaseOutbreak(
    @Args('id') id: string,
    @Args('input') input: any
  ) {
    return this.healthService.updateDiseaseOutbreak(id, input);
  }

  @Mutation(() => Object, { name: 'scheduleHealthAppointment' })
  @UseGuards(GqlAuthGuard)
  async scheduleHealthAppointment(
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.scheduleHealthAppointment(userId, input);
  }

  @Mutation(() => Object, { name: 'updateHealthAppointment' })
  @UseGuards(GqlAuthGuard)
  async updateHealthAppointment(
    @Args('id') id: string,
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.healthService.updateHealthAppointment(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'cancelHealthAppointment' })
  @UseGuards(GqlAuthGuard)
  async cancelHealthAppointment(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.healthService.cancelHealthAppointment(id, userId);
  }

  @Mutation(() => Boolean, { name: 'createVaccinationProgram' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  async createVaccinationProgram(@Args('input') input: any) {
    return this.healthService.createVaccinationProgram(input);
  }
}
