import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';
import { UpdateLogisticsDto } from './dto/update-logistics.dto';

@Injectable()
export class LogisticsService {
  constructor(private prisma: PrismaService) {}

  // Temporary workaround: Use Order model for logistics functionality
  // until Prisma client can be regenerated with Logistics model

  async createLogistics(userId: string, createLogisticsDto: CreateLogisticsDto) {
    // Create an order record to simulate logistics
    return this.prisma.order.create({
      data: {
        userId: userId,
        orderNumber: 'LOG_' + Date.now(),
        type: 'LOGISTICS',
        totalAmount: 0, // Will be updated later
        status: createLogisticsDto.deliveryStatus || 'PENDING',
        description: `Logistics for order ${createLogisticsDto.orderId}`,
        metadata: {
          type: 'logistics',
          orderId: createLogisticsDto.orderId,
          trackingNumber: createLogisticsDto.trackingNumber,
          deliveryAddress: createLogisticsDto.deliveryAddress,
          estimatedDelivery: createLogisticsDto.estimatedDelivery,
          notes: createLogisticsDto.notes,
        },
      },
    });
  }

  async getLogistics(userId: string, status?: string) {
    // Query orders with logistics metadata
    const where: any = {
      metadata: {
        path: ['type'],
        equals: 'logistics'
      }
    };
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLogisticsRecord(id: string, userId: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
        metadata: {
          path: ['type'],
          equals: 'logistics'
        },
        userId: userId,
      },
    });
  }

  async updateLogistics(id: string, userId: string, updateLogisticsDto: UpdateLogisticsDto) {
    const updateData: any = {
      status: updateLogisticsDto.deliveryStatus,
    };

    if (updateLogisticsDto.trackingNumber || updateLogisticsDto.deliveryAddress || 
        updateLogisticsDto.estimatedDelivery || updateLogisticsDto.notes) {
      updateData.metadata = {
        trackingNumber: updateLogisticsDto.trackingNumber,
        deliveryAddress: updateLogisticsDto.deliveryAddress,
        estimatedDelivery: updateLogisticsDto.estimatedDelivery,
        notes: updateLogisticsDto.notes,
      };
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
    });
  }

  async updateDeliveryStatus(id: string, userId: string, status: string, notes?: string) {
    const updateData: any = { status };
    if (notes) {
      updateData.metadata = {
        notes: notes,
        actualDelivery: status === 'DELIVERED' ? new Date() : undefined,
      };
    } else if (status === 'DELIVERED') {
      updateData.metadata = {
        actualDelivery: new Date(),
      };
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
    });
  }

  // Get available delivery jobs for logistics providers
  async getAvailableJobs() {
    return this.prisma.order.findMany({
      where: {
        status: 'CONFIRMED',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Accept a delivery job
  async acceptDeliveryJob(logisticsProviderId: string, orderId: string, estimatedDelivery?: Date) {
    // Generate tracking number
    const trackingNumber = this.generateTrackingNumber();

    return this.prisma.order.create({
      data: {
        userId: logisticsProviderId,
        orderNumber: 'LOG_' + Date.now(),
        type: 'LOGISTICS',
        totalAmount: 0,
        status: 'PENDING',
        description: `Logistics delivery for order ${orderId}`,
        metadata: {
          type: 'logistics',
          orderId: orderId,
          trackingNumber: trackingNumber,
          estimatedDelivery: estimatedDelivery,
        },
      },
    });
  }

  // Admin methods
  async getAllLogistics(status?: string) {
    const where: any = {
      metadata: {
        path: ['type'],
        equals: 'logistics'
      }
    };
    if (status) where.status = status;

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLogisticsStatus(id: string, status: string, notes?: string) {
    const updateData: any = { status };
    if (notes) {
      updateData.metadata = {
        notes: notes,
        actualDelivery: status === 'DELIVERED' ? new Date() : undefined,
      };
    } else if (status === 'DELIVERED') {
      updateData.metadata = {
        actualDelivery: new Date(),
      };
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
    });
  }

  async getLogisticsStats() {
    const logistics = await this.prisma.order.findMany({
      where: {
        metadata: {
          path: ['type'],
          equals: 'logistics'
        }
      }
    });

    const statusCount = logistics.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deliveredCount = logistics.filter(log => log.status === 'DELIVERED').length;
    const pendingCount = logistics.filter(log => ['PENDING', 'PICKED_UP', 'IN_TRANSIT'].includes(log.status)).length;

    return {
      totalDeliveries: logistics.length,
      deliveredCount,
      pendingCount,
      failedCount: statusCount['FAILED'] || 0,
      statusCount,
    };
  }

  // Additional methods for comprehensive logistics management
  async trackShipment(trackingNumber: string) {
    const shipment = await this.prisma.order.findFirst({
      where: {
        metadata: {
          path: ['trackingNumber'],
          equals: trackingNumber
        }
      },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    return {
      success: true,
      data: shipment,
    };
  }

  async getProviderStats(providerId: string) {
    const logistics = await this.prisma.order.findMany({
      where: {
        userId: providerId,
        metadata: {
          path: ['type'],
          equals: 'logistics'
        }
      },
    });

    const statusCount = logistics.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalRevenue = logistics
      .filter(log => log.status === 'DELIVERED' && log.totalAmount)
      .reduce((sum, log) => sum + Number(log.totalAmount), 0);

    const averageDeliveryTime = this.calculateAverageDeliveryTime(logistics);

    return {
      totalDeliveries: logistics.length,
      completedDeliveries: statusCount['DELIVERED'] || 0,
      pendingDeliveries: (statusCount['PENDING'] || 0) + (statusCount['PICKED_UP'] || 0) + (statusCount['IN_TRANSIT'] || 0),
      failedDeliveries: statusCount['FAILED'] || 0,
      totalRevenue,
      averageDeliveryTime,
      statusCount,
    };
  }

  private calculateAverageDeliveryTime(logistics: any[]): number {
    const completedDeliveries = logistics.filter(
      log => log.status === 'DELIVERED' && 
              log.metadata?.actualDelivery && 
              log.metadata?.estimatedDelivery
    );

    if (completedDeliveries.length === 0) return 0;

    const totalDays = completedDeliveries.reduce((sum, log) => {
      const estimated = new Date(log.metadata.estimatedDelivery);
      const actual = new Date(log.metadata.actualDelivery);
      const daysDiff = Math.abs(actual.getTime() - estimated.getTime()) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0);

    return totalDays / completedDeliveries.length;
  }

  private generateTrackingNumber(): string {
    const prefix = 'SHM';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
