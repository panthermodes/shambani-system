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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(@Request() req, @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(req.user.userId, createNotificationDto);
  }

  @Get()
  getNotifications(
    @Request() req,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('category') category?: string,
  ) {
    return this.notificationsService.getNotificationsSimple(
      req.user.userId,
      unreadOnly === 'true',
      category,
    );
  }

  @Get('unread/count')
  getUnreadCount(@Request() req, @Query('category') category?: string) {
    return this.notificationsService.getUnreadCount(req.user.userId, category);
  }

  @Get(':id')
  getNotification(@Param('id') id: string, @Request() req) {
    return this.notificationsService.getNotification(id, req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  deleteNotification(@Param('id') id: string, @Request() req) {
    return this.notificationsService.deleteNotification(id, req.user.userId);
  }

  // System notification endpoints
  @Post('system')
  @Roles('SUPER_ADMIN')
  sendSystemNotification(@Body() body: { title: string; message: string; category?: string; priority?: string }) {
    return this.notificationsService.sendSystemNotification(body.title, body.message, body.category, body.priority);
  }

  @Post('role/:role')
  @Roles('SUPER_ADMIN')
  sendNotificationToRole(
    @Param('role') role: string,
    @Body() body: { title: string; message: string; category?: string; priority?: string },
  ) {
    return this.notificationsService.sendNotificationToRole(role, body.title, body.message, body.category, body.priority);
  }

  @Post('broadcast')
  @Roles('SUPER_ADMIN')
  broadcastNotification(@Body() createNotificationDto: CreateNotificationDto & { roles?: string[] }) {
    return this.notificationsService.broadcastNotification(createNotificationDto);
  }

  // Admin endpoints
  @Get('admin/all')
  @Roles('SUPER_ADMIN')
  getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  @Get('admin/stats')
  @Roles('SUPER_ADMIN')
  getNotificationStats() {
    return this.notificationsService.getNotificationStats();
  }
}
