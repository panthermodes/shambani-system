import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FeedingService } from '../feeding/feeding.service';
import { CreateFeedingRecordDto } from '../feeding/dto/create-feeding-record.dto';
import { UpdateFeedingRecordDto } from '../feeding/dto/update-feeding-record.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class FeedingResolver {
  constructor(private readonly feedingService: FeedingService) {}

  @Query(() => [Object], { name: 'getFeedingRecords' })
  @UseGuards(GqlAuthGuard)
  async getFeedingRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.getFeedingRecords(userId, farmId, houseId, startDate, endDate);
  }

  @Query(() => Object, { name: 'getFeedingRecord' })
  @UseGuards(GqlAuthGuard)
  async getFeedingRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.feedingService.getFeedingRecord(id, userId);
  }

  @Query(() => [Object], { name: 'getFeedingSchedules' })
  @UseGuards(GqlAuthGuard)
  async getFeedingSchedules(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('isActive', { nullable: true }) isActive: boolean,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.getFeedingSchedules(userId, farmId, houseId, isActive);
  }

  @Query(() => Object, { name: 'getFeedingStats' })
  @UseGuards(GqlAuthGuard)
  async getFeedingStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Args('period', { nullable: true }) period: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.getFeedingStats(userId, farmId, houseId, startDate, endDate, period);
  }

  @Query(() => Object, { name: 'getAdminFeedingStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdminFeedingStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string,
    @Args('period', { nullable: true }) period: string
  ) {
    return this.feedingService.getAllFeedingStats(region, district, period);
  }

  @Query(() => [Object], { name: 'getUpcomingFeedingSchedule' })
  @UseGuards(GqlAuthGuard)
  async getUpcomingFeedingSchedule(@Context() context) {
    const userId = context.req.user.id;
    return this.feedingService.getUpcomingFeedingSchedule(userId);
  }

  @Query(() => [Object], { name: 'getFeedingRecommendations' })
  @UseGuards(GqlAuthGuard)
  async getFeedingRecommendations(
    @Args('chickenType') chickenType: string,
    @Args('chickenCount') chickenCount: number
  ) {
    return this.feedingService.getFeedingRecommendations(chickenType, chickenCount);
  }

  @Mutation(() => Object, { name: 'createFeedingRecord' })
  @UseGuards(GqlAuthGuard)
  async createFeedingRecord(
    @Args('input') input: CreateFeedingRecordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.createFeedingRecord(userId, input);
  }

  @Mutation(() => Object, { name: 'updateFeedingRecord' })
  @UseGuards(GqlAuthGuard)
  async updateFeedingRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateFeedingRecordDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.updateFeedingRecord(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteFeedingRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteFeedingRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.feedingService.deleteFeedingRecord(id, userId);
  }

  @Mutation(() => Object, { name: 'createFeedingSchedule' })
  @UseGuards(GqlAuthGuard)
  async createFeedingSchedule(
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.createFeedingSchedule(userId, input);
  }

  @Mutation(() => Object, { name: 'updateFeedingSchedule' })
  @UseGuards(GqlAuthGuard)
  async updateFeedingSchedule(
    @Args('id') id: string,
    @Args('input') input: any,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.feedingService.updateFeedingSchedule(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteFeedingSchedule' })
  @UseGuards(GqlAuthGuard)
  async deleteFeedingSchedule(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.feedingService.deleteFeedingSchedule(id, userId);
  }

  @Mutation(() => Object, { name: 'completeFeedingSchedule' })
  @UseGuards(GqlAuthGuard)
  async completeFeedingSchedule(@Args('scheduleId') scheduleId: string, @Context() context) {
    const userId = context.req.user.id;
    return this.feedingService.completeFeedingSchedule(scheduleId, userId);
  }

  @Mutation(() => Boolean, { name: 'createFeedingProgram' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EXTENSION_OFFICER')
  async createFeedingProgram(@Args('input') input: any) {
    return this.feedingService.createFeedingProgram(input);
  }
}
