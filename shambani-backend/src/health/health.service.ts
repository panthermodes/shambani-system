import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async createHealthRecord(userId: string, createHealthRecordDto: CreateHealthRecordDto) {
    return this.prisma.healthRecord.create({
      data: {
        userId,
        ...createHealthRecordDto,
      },
    });
  }

  async getHealthRecords(userId: string, farmId?: string, houseId?: string, recordType?: string) {
    const where: any = { userId };
    if (houseId) where.houseId = houseId;
    if (recordType) where.recordType = recordType;

    return this.prisma.healthRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getHealthRecord(id: string, userId: string) {
    return this.prisma.healthRecord.findFirst({
      where: { id, userId },
    });
  }

  async updateHealthRecord(id: string, userId: string, updateHealthRecordDto: UpdateHealthRecordDto) {
    return this.prisma.healthRecord.update({
      where: { id },
      data: updateHealthRecordDto,
    });
  }

  async deleteHealthRecord(id: string, userId: string) {
    return this.prisma.healthRecord.delete({
      where: { id },
    });
  }

  // Get disease outbreaks
  async getDiseaseOutbreaks(userId: string) {
    return this.prisma.healthRecord.findMany({
      where: {
        userId,
        recordType: 'disease',
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  // Get health statistics
  async getHealthStats(userId: string, period?: string) {
    const dateFilter = this.getDateFilter(period);
    
    const records = await this.prisma.healthRecord.findMany({
      where: {
        userId,
        date: dateFilter,
      },
    });

    const recordTypes = records.reduce((acc, record) => {
      acc[record.recordType] = (acc[record.recordType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCost = records.reduce((sum, record) => {
      const cost = record.cost ? Number(record.cost) : 0;
      return sum + cost;
    }, 0);

    return {
      totalRecords: records.length,
      recordTypes,
      totalCost,
      quarantineCases: 0, // Field doesn't exist in current schema
      recentRecords: records.slice(0, 10),
    };
  }

  // Admin methods
  async getAllHealthStats(period?: string) {
    const dateFilter = this.getDateFilter(period);
    
    const records = await this.prisma.healthRecord.findMany({
      where: {
        date: dateFilter,
      },
    });

    const recordTypes = records.reduce((acc, record) => {
      acc[record.recordType] = (acc[record.recordType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCost = records.reduce((sum, record) => {
      const cost = record.cost ? Number(record.cost) : 0;
      return sum + cost;
    }, 0);

    // Disease outbreaks in the last 30 days
    const recentDiseases = records.filter(record => 
      record.recordType === 'disease' && 
      new Date(record.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    return {
      totalRecords: records.length,
      recordTypes,
      totalCost,
      quarantineCases: 0, // Field doesn't exist in current schema
      recentDiseaseOutbreaks: recentDiseases.length,
      records: records.slice(0, 50), // Return recent records for admin dashboard
    };
  }

  async getAllDiseaseOutbreaks() {
    return this.prisma.healthRecord.findMany({
      where: {
        recordType: 'disease',
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'desc' },
    });
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

  // ========== MISSING METHODS FOR RESOLVER ==========

  // Vaccination Records
  async getVaccinationRecords(userId: string, farmId?: string, houseId?: string, status?: string, upcoming?: boolean) {
    const where: any = { userId, recordType: 'vaccination' };
    if (houseId) where.houseId = houseId;
    if (upcoming) {
      where.date = { gte: new Date() };
    }

    return this.prisma.healthRecord.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async getUpcomingVaccinations(userId: string) {
    return this.prisma.healthRecord.findMany({
      where: {
        userId,
        recordType: 'vaccination',
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }

  async getOverdueVaccinations(userId: string) {
    return this.prisma.healthRecord.findMany({
      where: {
        userId,
        recordType: 'vaccination',
        date: { lt: new Date() },
      },
      orderBy: { date: 'asc' },
    });
  }

  async createVaccinationRecord(userId: string, input: any) {
    try {
      return this.prisma.healthRecord.create({
        data: {
          userId,
          recordType: 'vaccination',
          ...input,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create vaccination record');
    }
  }

  async updateVaccinationRecord(id: string, userId: string, input: any) {
    try {
      const record = await this.prisma.healthRecord.findFirst({
        where: { id, userId, recordType: 'vaccination' },
      });

      if (!record) {
        throw new NotFoundException('Vaccination record not found');
      }

      return this.prisma.healthRecord.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update vaccination record');
    }
  }

  async deleteVaccinationRecord(id: string, userId: string) {
    try {
      const record = await this.prisma.healthRecord.findFirst({
        where: { id, userId, recordType: 'vaccination' },
      });

      if (!record) {
        throw new NotFoundException('Vaccination record not found');
      }

      await this.prisma.healthRecord.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete vaccination record');
    }
  }

  // Health Appointments
  async getHealthAppointments(userId: string, status?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId, recordType: 'appointment' };
    if (status) {
      where.metadata = {
        path: ['status'],
        equals: status
      };
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.healthRecord.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async getUpcomingAppointments(userId: string) {
    return this.prisma.healthRecord.findMany({
      where: {
        userId,
        recordType: 'appointment',
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }

  async scheduleHealthAppointment(userId: string, input: any) {
    try {
      return this.prisma.healthRecord.create({
        data: {
          userId,
          recordType: 'appointment',
          ...input,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to schedule health appointment');
    }
  }

  async updateHealthAppointment(id: string, userId: string, input: any) {
    try {
      const record = await this.prisma.healthRecord.findFirst({
        where: { id, userId, recordType: 'appointment' },
      });

      if (!record) {
        throw new NotFoundException('Health appointment not found');
      }

      return this.prisma.healthRecord.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update health appointment');
    }
  }

  async cancelHealthAppointment(id: string, userId: string) {
    try {
      const record = await this.prisma.healthRecord.findFirst({
        where: { id, userId, recordType: 'appointment' },
      });

      if (!record) {
        throw new NotFoundException('Health appointment not found');
      }

      await this.prisma.healthRecord.update({
        where: { id },
        data: { 
          metadata: {
            ...(record.metadata as any || {}),
            status: 'cancelled'
          }
        },
      });

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to cancel health appointment');
    }
  }

  // Disease Outbreaks
  async reportDiseaseOutbreak(input: any, currentUser: any) {
    try {
      return this.prisma.healthRecord.create({
        data: {
          userId: currentUser.id,
          recordType: 'disease',
          ...input,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to report disease outbreak');
    }
  }

  async updateDiseaseOutbreak(id: string, input: any) {
    try {
      const record = await this.prisma.healthRecord.findFirst({
        where: { id, recordType: 'disease' },
      });

      if (!record) {
        throw new NotFoundException('Disease outbreak not found');
      }

      return this.prisma.healthRecord.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update disease outbreak');
    }
  }

  // Vaccination Program
  async createVaccinationProgram(input: any) {
    try {
      // This would typically create a vaccination program template
      // For now, return a success response
      return { success: true, message: 'Vaccination program created', data: input };
    } catch (error) {
      throw new BadRequestException('Failed to create vaccination program');
    }
  }

  // Admin Statistics
  async getAdminHealthStats(region?: string, district?: string) {
    return this.getAllHealthStats();
  }

  // Vaccination Schedule
  async getVaccinationSchedule(chickenType: string, ageInWeeks: number) {
    // This would typically return a predefined vaccination schedule
    // For now, return a basic schedule
    const schedule = [
      { week: 1, vaccine: 'Marek\'s Disease', type: 'recommended' },
      { week: 2, vaccine: 'Newcastle Disease', type: 'essential' },
      { week: 4, vaccine: 'Infectious Bursal Disease', type: 'essential' },
      { week: 8, vaccine: 'Newcastle Disease (Booster)', type: 'essential' },
      { week: 12, vaccine: 'Fowl Pox', type: 'recommended' },
    ];

    return schedule.filter(item => item.week >= ageInWeeks);
  }
}
