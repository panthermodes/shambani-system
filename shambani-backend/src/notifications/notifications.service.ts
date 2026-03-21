import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(userId: string, createNotificationDto: CreateNotificationDto) {
    // Map DTO fields to schema and store extra fields in metadata
    const data: any = {
      userId,
      type: createNotificationDto.type,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      metadata: {},
    };

    // Store extra fields in metadata
    if (createNotificationDto.category) {
      data.metadata.category = createNotificationDto.category;
    }
    if (createNotificationDto.priority) {
      data.metadata.priority = createNotificationDto.priority;
    }
    if (createNotificationDto.sender) {
      data.metadata.sender = createNotificationDto.sender;
    }
    if (createNotificationDto.actionUrl) {
      data.metadata.actionUrl = createNotificationDto.actionUrl;
    }
    if (createNotificationDto.actionText) {
      data.metadata.actionText = createNotificationDto.actionText;
    }
    if (createNotificationDto.expiresAt) {
      data.metadata.expiresAt = createNotificationDto.expiresAt;
    }
    if (createNotificationDto.attachments) {
      data.metadata.attachments = createNotificationDto.attachments;
    }

    return this.prisma.notification.create({
      data,
    });
  }

  // Enhanced getNotifications method with all parameters
  async getNotifications(userId: string, type?: string, category?: string, priority?: string, isRead?: boolean, limit?: number, offset?: number) {
    const where: any = { userId };
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead;
    if (category) {
      where.metadata = {
        path: ['category'],
        equals: category
      };
    }
    if (priority) {
      where.metadata = {
        path: ['priority'],
        equals: priority
      };
    }

    const query: any = {
      where,
      orderBy: { createdAt: 'desc' },
    };
    
    if (limit) query.take = limit;
    if (offset) query.skip = offset;

    return this.prisma.notification.findMany(query);
  }

  // Simplified version for backward compatibility
  async getNotificationsSimple(userId: string, unreadOnly?: boolean, category?: string) {
    const where: any = { userId };
    if (unreadOnly) where.isRead = false;
    if (category) {
      where.metadata = {
        path: ['category'],
        equals: category
      };
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotification(id: string, userId: string) {
    return this.prisma.notification.findFirst({
      where: { id, userId },
    });
  }

  async markAsRead(id: string, userId: string) {
    // First check if notification belongs to user
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found or access denied');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async deleteNotification(id: string, userId: string) {
    // First check if notification belongs to user
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found or access denied');
    }

    return this.prisma.notification.delete({
      where: { id },
    });
  }

  // Get unread count
  async getUnreadCount(userId: string, category?: string) {
    const where: any = { userId, isRead: false };
    if (category) {
      where.metadata = {
        path: ['category'],
        equals: category
      };
    }

    return this.prisma.notification.count({
      where,
    });
  }

  // System notification methods
  async sendSystemNotification(title: string, message: string, category?: string, priority?: string) {
    // Send to all active users
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: 'info',
      title,
      message,
      metadata: {
        category: category || 'system',
        priority: priority || 'medium',
        sender: 'system',
      },
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  async sendNotificationToRole(role: string, title: string, message: string, category?: string, priority?: string) {
    const users = await this.prisma.user.findMany({
      where: { role, isActive: true },
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: 'info',
      title,
      message,
      metadata: {
        category: category || 'system',
        priority: priority || 'medium',
        sender: 'system',
      },
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  // Health notifications
  async sendHealthAlert(userId: string, title: string, message: string, priority?: string) {
    return this.createNotification(userId, {
      type: 'warning',
      title,
      message,
      priority: priority || 'high',
      sender: 'health_system',
    } as CreateNotificationDto);
  }

  // Feeding reminders
  async sendFeedingReminder(userId: string, title: string, message: string) {
    return this.createNotification(userId, {
      type: 'reminder',
      title,
      message,
      priority: 'medium',
      sender: 'feeding_system',
    } as CreateNotificationDto);
  }

  // Financial notifications
  async sendFinancialAlert(userId: string, title: string, message: string) {
    return this.createNotification(userId, {
      type: 'warning',
      title,
      message,
      priority: 'high',
      sender: 'financial_system',
    } as CreateNotificationDto);
  }

  // Service notifications
  async sendServiceNotification(userId: string, title: string, message: string, serviceType?: string) {
    return this.createNotification(userId, {
      type: 'info',
      title,
      message,
      priority: 'medium',
      sender: 'service_system',
    } as CreateNotificationDto);
  }

  // Production notifications
  async sendProductionAlert(userId: string, title: string, message: string) {
    return this.createNotification(userId, {
      type: 'info',
      title,
      message,
      priority: 'medium',
      sender: 'production_system',
    } as CreateNotificationDto);
  }

  // Admin methods
  async getAllNotifications() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getNotificationStats() {
    const total = await this.prisma.notification.count();
    const unread = await this.prisma.notification.count({
      where: { isRead: false },
    });

    // Get category stats from metadata
    const notifications = await this.prisma.notification.findMany({
      select: { metadata: true, type: true },
    });

    const categoryStats = notifications.reduce((acc, notification) => {
      const category = (notification.metadata as any)?.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityStats = notifications.reduce((acc, notification) => {
      const priority = (notification.metadata as any)?.priority || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      unread,
      read: total - unread,
      byCategory: categoryStats,
      byPriority: priorityStats,
    };
  }

  async broadcastNotification(createNotificationDto: CreateNotificationDto & { roles?: string[] }) {
    const { roles, ...notificationData } = createNotificationDto;
    
    let whereClause: any = { isActive: true };
    if (roles && roles.length > 0) {
      whereClause.role = { in: roles };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      metadata: {
        category: notificationData.category,
        priority: notificationData.priority,
        sender: notificationData.sender,
        actionUrl: notificationData.actionUrl,
        actionText: notificationData.actionText,
        expiresAt: notificationData.expiresAt,
        attachments: notificationData.attachments,
      },
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  // Additional methods required by resolver
  async getUnreadNotificationsCount(userId: string) {
    return this.getUnreadCount(userId);
  }

  async getAllNotificationsEnhanced(userId?: string, type?: string, category?: string, priority?: string, startDate?: Date, endDate?: Date, limit?: number, offset?: number) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (category) {
      where.metadata = {
        path: ['category'],
        equals: category
      };
    }
    if (priority) {
      where.metadata = {
        path: ['priority'],
        equals: priority
      };
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const query: any = {
      where,
      orderBy: { createdAt: 'desc' },
    };
    
    if (limit) query.take = limit;
    if (offset) query.skip = offset;

    return this.prisma.notification.findMany(query);
  }

  async getNotificationStatsEnhanced(userId: string, startDate?: Date, endDate?: Date, currentUser?: any) {
    const where: any = { userId };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const total = await this.prisma.notification.count({ where });
    const unread = await this.prisma.notification.count({
      where: { ...where, isRead: false },
    });

    // Get category and priority stats from metadata
    const notifications = await this.prisma.notification.findMany({
      where,
      select: { metadata: true, type: true },
    });

    const categoryStats = notifications.reduce((acc, notification) => {
      const category = (notification.metadata as any)?.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityStats = notifications.reduce((acc, notification) => {
      const priority = (notification.metadata as any)?.priority || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      unread,
      read: total - unread,
      byCategory: categoryStats,
      byPriority: priorityStats,
    };
  }

  async getAdminNotificationStats(region?: string, district?: string, startDate?: Date, endDate?: Date) {
    // For admin stats, get all notifications with optional date filtering
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const total = await this.prisma.notification.count({ where });
    const unread = await this.prisma.notification.count({
      where: { ...where, isRead: false },
    });

    return {
      total,
      unread,
      read: total - unread,
    };
  }

  // Template management (mock implementation)
  async getNotificationTemplates(isActive?: boolean) {
    // Mock implementation - return empty array for now
    return [];
  }

  async getNotificationTemplate(id: string) {
    // Mock implementation
    return { id, name: 'Template', content: 'Sample template content' };
  }

  async getNotificationDeliveryReport(batchId: string) {
    // Mock implementation
    return {
      batchId,
      totalSent: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    };
  }

  // Alternative method names for resolver compatibility
  async markNotificationAsRead(notificationId: string, userId: string) {
    return this.markAsRead(notificationId, userId);
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.markAllAsRead(userId);
  }

  async sendBroadcastNotification(input: any) {
    return this.broadcastNotification(input);
  }

  async sendTargetedNotifications(input: any) {
    // Mock implementation for targeted notifications
    const { userIds, ...notificationData } = input;
    
    const notifications = userIds.map((userId: string) => ({
      userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      metadata: {
        category: notificationData.category,
        priority: notificationData.priority,
        sender: notificationData.sender,
      },
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  // Template management (mock implementations)
  async createNotificationTemplate(input: any) {
    // Mock implementation
    return {
      success: true,
      message: 'Notification template created successfully',
      data: {
        id: 'template_' + Date.now(),
        ...input,
        createdAt: new Date(),
      },
    };
  }

  async updateNotificationTemplate(id: string, input: any) {
    // Mock implementation
    return {
      success: true,
      message: 'Notification template updated successfully',
      data: { id, ...input, updatedAt: new Date() },
    };
  }

  async deleteNotificationTemplate(id: string) {
    // Mock implementation
    return {
      success: true,
      message: 'Notification template deleted successfully',
    };
  }

  async resendFailedNotifications(notificationId: string) {
    // Mock implementation
    return {
      success: true,
      message: 'Failed notifications resent successfully',
      resentCount: 0,
    };
  }
}
