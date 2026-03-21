import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Object], { name: 'getNotifications' })
  @UseGuards(GqlAuthGuard)
  async getNotifications(
    @Args('type', { nullable: true }) type: string,
    @Args('category', { nullable: true }) category: string,
    @Args('priority', { nullable: true }) priority: string,
    @Args('isRead', { nullable: true }) isRead: boolean,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.notificationsService.getNotifications(userId, type, category, priority, isRead, limit, offset);
  }

  @Query(() => Object, { name: 'getNotification' })
  @UseGuards(GqlAuthGuard)
  async getNotification(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.notificationsService.getNotification(id, userId);
  }

  @Query(() => Number, { name: 'getUnreadNotificationsCount' })
  @UseGuards(GqlAuthGuard)
  async getUnreadNotificationsCount(@Context() context) {
    const userId = context.req.user.id;
    return this.notificationsService.getUnreadNotificationsCount(userId);
  }

  @Query(() => [Object], { name: 'getAllNotifications' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAllNotifications(
    @Args('userId', { nullable: true }) userId: string,
    @Args('type', { nullable: true }) type: string,
    @Args('category', { nullable: true }) category: string,
    @Args('priority', { nullable: true }) priority: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number
  ) {
    return this.notificationsService.getAllNotificationsEnhanced(userId, type, category, priority, startDate, endDate, limit, offset);
  }

  @Query(() => Object, { name: 'getNotificationStats' })
  @UseGuards(GqlAuthGuard)
  async getNotificationStats(
    @Args('userId', { nullable: true }) userId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const currentUser = context.req.user;
    const targetUserId = userId || currentUser.id;
    return this.notificationsService.getNotificationStatsEnhanced(targetUserId, startDate, endDate, currentUser);
  }

  @Query(() => Object, { name: 'getAdminNotificationStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdminNotificationStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date
  ) {
    return this.notificationsService.getAdminNotificationStats(region, district, startDate, endDate);
  }

  @Query(() => [Object], { name: 'getNotificationTemplates' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getNotificationTemplates(@Args('isActive', { nullable: true }) isActive: boolean) {
    return this.notificationsService.getNotificationTemplates(isActive);
  }

  @Query(() => Object, { name: 'getNotificationTemplate' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getNotificationTemplate(@Args('id') id: string) {
    return this.notificationsService.getNotificationTemplate(id);
  }

  @Query(() => Object, { name: 'getNotificationDeliveryReport' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getNotificationDeliveryReport(@Args('batchId') batchId: string) {
    return this.notificationsService.getNotificationDeliveryReport(batchId);
  }

  @Mutation(() => Object, { name: 'createNotification' })
  @UseGuards(GqlAuthGuard)
  async createNotification(
    @Args('input') input: CreateNotificationDto,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.notificationsService.createNotification(userId, input);
  }

  @Mutation(() => Object, { name: 'markNotificationAsRead' })
  @UseGuards(GqlAuthGuard)
  async markNotificationAsRead(
    @Args('notificationId') notificationId: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.notificationsService.markNotificationAsRead(notificationId, userId);
  }

  @Mutation(() => Boolean, { name: 'markAllNotificationsAsRead' })
  @UseGuards(GqlAuthGuard)
  async markAllNotificationsAsRead(@Context() context) {
    const userId = context.req.user.id;
    return this.notificationsService.markAllNotificationsAsRead(userId);
  }

  @Mutation(() => Boolean, { name: 'deleteNotification' })
  @UseGuards(GqlAuthGuard)
  async deleteNotification(
    @Args('notificationId') notificationId: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.notificationsService.deleteNotification(notificationId, userId);
  }

  @Mutation(() => [Object], { name: 'sendSystemNotification' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async sendSystemNotification(@Args('input') input: any) {
    return this.notificationsService.sendSystemNotification(input.title, input.message, input.category, input.priority);
  }

  @Mutation(() => [Object], { name: 'sendNotificationToRole' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async sendNotificationToRole(
    @Args('role') role: string,
    @Args('input') input: any
  ) {
    return this.notificationsService.sendNotificationToRole(role, input.title, input.message, input.category, input.priority);
  }

  @Mutation(() => [Object], { name: 'sendBroadcastNotification' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async sendBroadcastNotification(@Args('input') input: any) {
    return this.notificationsService.sendBroadcastNotification(input);
  }

  @Mutation(() => [Object], { name: 'sendTargetedNotifications' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async sendTargetedNotifications(@Args('input') input: any) {
    return this.notificationsService.sendTargetedNotifications(input);
  }

  @Mutation(() => Object, { name: 'createNotificationTemplate' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async createNotificationTemplate(@Args('input') input: any) {
    return this.notificationsService.createNotificationTemplate(input);
  }

  @Mutation(() => Object, { name: 'updateNotificationTemplate' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateNotificationTemplate(
    @Args('id') id: string,
    @Args('input') input: any
  ) {
    return this.notificationsService.updateNotificationTemplate(id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteNotificationTemplate' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async deleteNotificationTemplate(@Args('id') id: string) {
    return this.notificationsService.deleteNotificationTemplate(id);
  }

  @Mutation(() => Boolean, { name: 'resendFailedNotifications' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async resendFailedNotifications(@Args('notificationId') notificationId: string) {
    return this.notificationsService.resendFailedNotifications(notificationId);
  }
}
