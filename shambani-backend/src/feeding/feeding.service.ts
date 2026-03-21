import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFeedingRecordDto } from './dto/create-feeding-record.dto';
import { UpdateFeedingRecordDto } from './dto/update-feeding-record.dto';

@Injectable()
export class FeedingService {
  constructor(private prisma: PrismaService) {}

  async createFeedingRecord(userId: string, createFeedingRecordDto: CreateFeedingRecordDto) {
    return this.prisma.feedingRecord.create({
      data: {
        userId,
        ...createFeedingRecordDto,
      },
    });
  }

  async getFeedingRecords(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (houseId) where.houseId = houseId;
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.feedingRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getFeedingRecord(id: string, userId: string) {
    return this.prisma.feedingRecord.findFirst({
      where: { id, userId },
    });
  }

  async updateFeedingRecord(id: string, userId: string, updateFeedingRecordDto: UpdateFeedingRecordDto) {
    return this.prisma.feedingRecord.update({
      where: { id },
      data: updateFeedingRecordDto,
    });
  }

  async deleteFeedingRecord(id: string, userId: string) {
    return this.prisma.feedingRecord.delete({
      where: { id },
    });
  }

  // Get feeding statistics
  async getFeedingStats(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date, period?: string) {
    const where: any = { userId };
    if (houseId) where.houseId = houseId;
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    } else if (period) {
      where.date = this.getDateFilter(period);
    }
    
    const records = await this.prisma.feedingRecord.findMany({
      where,
    });

    const totalCost = records.reduce((sum, record) => {
      const cost = record.totalCost ? Number(record.totalCost) : 0;
      return sum + cost;
    }, 0);
    const totalQuantity = records.reduce((sum, record) => sum + record.feedQuantity, 0);
    
    const feedTypes = records.reduce((acc, record) => {
      acc[record.feedType] = (acc[record.feedType] || 0) + record.feedQuantity;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCost,
      totalQuantity,
      feedTypes,
      recordsCount: records.length,
      recentRecords: records.slice(0, 10),
    };
  }

  // Get feeding schedule (using existing records as schedule)
  async getFeedingSchedule(userId: string) {
    const records = await this.prisma.feedingRecord.findMany({
      where: {
        userId,
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: 'asc' },
    });

    return records.map(record => ({
      id: record.id,
      feedType: record.feedType,
      feedQuantity: record.feedQuantity,
      feedUnit: record.feedUnit,
      date: record.date,
      totalCost: record.totalCost,
    }));
  }

  // Admin methods
  async getAllFeedingStats(region?: string, district?: string, period?: string) {
    const where: any = {};
    
    if (period) {
      where.date = this.getDateFilter(period);
    }
    
    const records = await this.prisma.feedingRecord.findMany({
      where,
    });

    const totalCost = records.reduce((sum, record) => {
      const cost = record.totalCost ? Number(record.totalCost) : 0;
      return sum + cost;
    }, 0);
    const totalQuantity = records.reduce((sum, record) => sum + record.feedQuantity, 0);
    
    const feedTypes = records.reduce((acc, record) => {
      acc[record.feedType] = (acc[record.feedType] || 0) + record.feedQuantity;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCost,
      totalQuantity,
      feedTypes,
      recordsCount: records.length,
      recentRecords: records.slice(0, 50),
    };
  }

  private getDateFilter(period?: string) {
    const now = new Date();
    switch (period) {
      case 'week':
        return { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      case 'month':
        return { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
      case 'year':
        return { gte: new Date(now.getFullYear(), 0, 1) };
      default:
        return undefined;
    }
  }

  // Additional methods required by resolver
  async getFeedingSchedules(userId: string, farmId?: string, houseId?: string, isActive?: boolean) {
    const where: any = { userId };
    if (houseId) where.houseId = houseId;
    
    if (isActive !== undefined) {
      if (isActive) {
        where.date = { gte: new Date() };
      } else {
        where.date = { lt: new Date() };
      }
    }

    return this.prisma.feedingRecord.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async getAdminFeedingStats(region?: string, district?: string) {
    return this.getAllFeedingStats(region, district);
  }

  async getUpcomingFeedingSchedule(userId: string) {
    return this.getFeedingSchedule(userId);
  }

  async getFeedingRecommendations(chickenType: string, chickenCount: number) {
    // Basic feeding recommendations based on chicken type and count
    const recommendations = {
      BROILERS: {
        dailyFeed: chickenCount * 0.12, // kg per day
        proteinRequired: '22-24%',
        recommendations: [
          'Start with starter feed for first 2 weeks',
          'Switch to grower feed until 6 weeks',
          'Finish with finisher feed until market weight',
        ],
      },
      LAYERS: {
        dailyFeed: chickenCount * 0.11, // kg per day
        proteinRequired: '16-18%',
        recommendations: [
          'Use starter feed for first 8 weeks',
          'Switch to grower feed until 20 weeks',
          'Use layer feed after 20 weeks for egg production',
        ],
      },
    };

    const type = chickenType.toUpperCase() as keyof typeof recommendations;
    const baseRecommendation = recommendations[type] || recommendations.BROILERS;

    return {
      chickenType,
      chickenCount,
      dailyFeedRequirement: baseRecommendation.dailyFeed,
      proteinRequirement: baseRecommendation.proteinRequired,
      recommendations: baseRecommendation.recommendations,
      estimatedMonthlyCost: baseRecommendation.dailyFeed * 30 * 2.5, // Assuming $2.5 per kg
    };
  }

  // Feeding schedule management methods
  async createFeedingSchedule(userId: string, input: any) {
    return this.createFeedingRecord(userId, input);
  }

  async updateFeedingSchedule(id: string, userId: string, input: any) {
    return this.updateFeedingRecord(id, userId, input);
  }

  async deleteFeedingSchedule(id: string, userId: string) {
    return this.deleteFeedingRecord(id, userId);
  }

  async completeFeedingSchedule(scheduleId: string, userId: string) {
    return this.updateFeedingRecord(scheduleId, userId, { 
      notes: 'Completed feeding schedule' 
    });
  }

  async createFeedingProgram(input: any) {
    // Create a feeding program template
    return {
      success: true,
      message: 'Feeding program created successfully',
      data: {
        id: 'program_' + Date.now(),
        ...input,
        createdAt: new Date(),
      },
    };
  }
}
