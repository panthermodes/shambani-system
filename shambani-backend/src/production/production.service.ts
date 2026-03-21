import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductionRecordDto } from './dto/create-production-record.dto';
import { UpdateProductionRecordDto } from './dto/update-production-record.dto';
import {
  CreateProductionRecordInputType,
  UpdateProductionRecordInputType,
  CreateEggProductionInputType,
  UpdateEggProductionInputType,
  CreateChickHatchingInputType,
  UpdateChickHatchingInputType,
  CreateMortalityRecordInputType,
  UpdateMortalityRecordInputType,
  CreateWeightRecordInputType,
  UpdateWeightRecordInputType
} from './decorators/production.decorators';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  async createProductionRecord(userId: string, createProductionRecordDto: CreateProductionRecordInputType | CreateProductionRecordDto) {
    // Convert GraphQL input to DTO format
    const dto = createProductionRecordDto as CreateProductionRecordDto;
    if ('productionType' in createProductionRecordDto) {
      // This is GraphQL input
      const graphqlInput = createProductionRecordDto as CreateProductionRecordInputType;
      return this.prisma.productionRecord.create({
        data: {
          userId,
          farmId: graphqlInput.farmId,
          houseId: graphqlInput.houseId,
          recordType: graphqlInput.productionType,
          date: graphqlInput.productionDate,
          quantity: graphqlInput.quantity,
          unit: graphqlInput.unit,
          quality: graphqlInput.quality,
          notes: graphqlInput.notes,
          data: JSON.stringify({
            chickenType: graphqlInput.chickenType,
            chickenCount: graphqlInput.chickenCount,
            weightPerUnit: graphqlInput.weightPerUnit,
            totalWeight: graphqlInput.totalWeight,
            hatchRate: graphqlInput.hatchRate,
            fertilityRate: graphqlInput.fertilityRate,
            mortalityRate: graphqlInput.mortalityRate,
            sellingPrice: graphqlInput.sellingPrice,
            cost: graphqlInput.cost,
          }),
        } as any,
      });
    } else {
      // This is REST DTO
      const { data, ...rest } = dto;
      return this.prisma.productionRecord.create({
        data: {
          userId,
          ...rest,
          data: data ? (typeof data === 'string' ? JSON.parse(data) : data) : {},
        },
      });
    }
  }

  async getProductionRecords(userId: string, farmId?: string, houseId?: string, recordType?: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };
    if (farmId) where.farmId = farmId;
    if (houseId) where.houseId = houseId;
    if (recordType) where.recordType = recordType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getProductionRecord(id: string, userId: string) {
    return this.prisma.productionRecord.findFirst({
      where: { id, userId },
    });
  }

  async updateProductionRecord(id: string, userId: string, updateProductionRecordDto: UpdateProductionRecordInputType | UpdateProductionRecordDto) {
    // First verify the record belongs to the user
    const existingRecord = await this.prisma.productionRecord.findFirst({
      where: { id, userId }
    });
    
    if (!existingRecord) {
      throw new Error('Production record not found or access denied');
    }

    if ('productionType' in updateProductionRecordDto) {
      // This is GraphQL input
      const graphqlInput = updateProductionRecordDto as UpdateProductionRecordInputType;
      const updateData: any = {
        farmId: graphqlInput.farmId,
        houseId: graphqlInput.houseId,
        recordType: graphqlInput.productionType,
        quantity: graphqlInput.quantity,
        unit: graphqlInput.unit,
        quality: graphqlInput.quality,
        notes: graphqlInput.notes,
      };
      
      if (graphqlInput.productionDate) {
        updateData.date = graphqlInput.productionDate;
      }
      
      updateData.data = JSON.stringify({
        ...(existingRecord.data as any),
        chickenType: graphqlInput.chickenType,
        chickenCount: graphqlInput.chickenCount,
        weightPerUnit: graphqlInput.weightPerUnit,
        totalWeight: graphqlInput.totalWeight,
        hatchRate: graphqlInput.hatchRate,
        fertilityRate: graphqlInput.fertilityRate,
        mortalityRate: graphqlInput.mortalityRate,
        sellingPrice: graphqlInput.sellingPrice,
        cost: graphqlInput.cost,
      });
      
      return this.prisma.productionRecord.update({
        where: { id },
        data: updateData,
      });
    } else {
      // This is REST DTO
      const dto = updateProductionRecordDto as UpdateProductionRecordDto;
      const { data, ...rest } = dto;
      
      return this.prisma.productionRecord.update({
        where: { id },
        data: {
          ...rest,
          data: data ? (typeof data === 'string' ? JSON.parse(data) : data) : existingRecord.data,
        },
      });
    }
  }

  async deleteProductionRecord(id: string, userId: string) {
    // First verify the record belongs to the user
    const existingRecord = await this.prisma.productionRecord.findFirst({
      where: { id, userId }
    });
    
    if (!existingRecord) {
      throw new Error('Production record not found or access denied');
    }
    
    return this.prisma.productionRecord.delete({
      where: { id },
    });
  }

  // Get egg production statistics with full parameter support
  async getEggProduction(
    userId: string, 
    farmId?: string, 
    houseId?: string, 
    startDate?: Date, 
    endDate?: Date
  ) {
    const where: any = {
      userId,
      recordType: 'eggs_produced'
    };
    
    if (farmId) where.farmId = farmId;
    if (houseId) where.houseId = houseId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    
    const records = await this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const totalEggs = records.reduce((sum, record) => {
      const data = record.data as any;
      return sum + (data?.quantity || 0);
    }, 0);
    const averageDaily = records.length > 0 ? totalEggs / records.length : 0;

    // Group by date for trend analysis
    const dailyProduction = records.reduce((acc, record) => {
      const date = record.date.toISOString().split('T')[0];
      const data = record.data as any;
      acc[date] = (acc[date] || 0) + (data?.quantity || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEggs,
      averageDaily,
      dailyProduction,
      recordsCount: records.length,
      recentRecords: records.slice(0, 10),
    };
  }

  // Get chick hatching statistics with full parameter support
  async getChickHatching(
    userId: string, 
    farmId?: string, 
    houseId?: string, 
    startDate?: Date, 
    endDate?: Date
  ) {
    const where: any = {
      userId,
      recordType: 'chicks_hatched'
    };
    
    if (farmId) where.farmId = farmId;
    if (houseId) where.houseId = houseId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    
    const records = await this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const totalChicks = records.reduce((sum, record) => {
      const data = record.data as any;
      return sum + (data?.quantity || 0);
    }, 0);
    const averageBatch = records.length > 0 ? totalChicks / records.length : 0;

    return {
      totalChicks,
      averageBatch,
      recordsCount: records.length,
      recentRecords: records.slice(0, 10),
    };
  }

  // Get production statistics with full parameter support
  async getProductionStats(
    userId: string, 
    farmId?: string, 
    houseId?: string, 
    startDate?: Date, 
    endDate?: Date
  ) {
    const where: any = { userId };
    
    if (farmId) where.farmId = farmId;
    if (houseId) where.houseId = houseId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    
    const records = await this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // Group by record type
    const stats = records.reduce((acc, record) => {
      const data = record.data as any;
      acc[record.recordType] = (acc[record.recordType] || 0) + (data?.quantity || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRecords: records.length,
      byType: stats,
      recentRecords: records.slice(0, 10),
    };
  }

  // Get chick hatching statistics
  async getChickHatchingStats(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    return this.getChickHatching(userId, farmId, houseId, startDate, endDate);
  }

  // Get mortality statistics
  async getMortalityStats(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      userId,
      recordType: 'mortality'
    };
    
    if (farmId) where.farmId = farmId;
    if (houseId) where.houseId = houseId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    
    const records = await this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const totalMortality = records.reduce((sum, record) => {
      const data = record.data as any;
      return sum + (data?.quantity || 0);
    }, 0);
    const mortalityRate = records.length > 0 ? (totalMortality / records.length) * 100 : 0;

    return {
      totalDeaths: totalMortality,
      averageMortalityRate: mortalityRate,
      deathsByCause: [],
      deathsByAge: [],
      costOfMortality: 0,
      monthlyTrend: [],
    };
  }

  // Get weight gain statistics
  async getWeightGainStats(userId: string, farmId?: string, houseId?: string, chickenType?: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      userId,
      recordType: 'weight_gain'
    };
    
    if (farmId) where.farmId = farmId;
    if (houseId) where.houseId = houseId;
    if (chickenType) {
      where.data = {
        path: ['chickenType'],
        equals: chickenType
      };
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    
    const records = await this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const averageWeight = records.length > 0 
      ? records.reduce((sum, record) => {
          const data = record.data as any;
          return sum + (data?.quantity || 0);
        }, 0) / records.length 
      : 0;

    return {
      averageWeightGain: averageWeight,
      averageFeedConversionRatio: 0,
      performanceDistribution: [],
      weightByAge: [],
      targetAchievement: 0,
    };
  }

  // Get overall production dashboard
  async getProductionDashboard(userId: string, period?: string) {
    const dateFilter = period ? this.getDateFilter(period) : undefined;
    
    const where: any = { userId };
    if (dateFilter) where.date = dateFilter;
    
    const records = await this.prisma.productionRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const recordTypes = records.reduce((acc, record) => {
      const data = record.data as any;
      acc[record.recordType] = (acc[record.recordType] || 0) + (data?.quantity || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      todayProduction: {
        eggsProduced: recordTypes['eggs_produced'] || 0,
        chicksHatched: recordTypes['chicks_hatched'] || 0,
        currentMortality: recordTypes['mortality'] || 0,
        revenue: 0,
      },
      weeklyComparison: {
        thisWeek: { production: 0, revenue: 0, cost: 0, profit: 0 },
        lastWeek: { production: 0, revenue: 0, cost: 0, profit: 0 },
        changePercentage: 0,
      },
      monthlyOverview: {
        currentMonth: { production: 0, revenue: 0, cost: 0, profit: 0 },
        lastMonth: { production: 0, revenue: 0, cost: 0, profit: 0 },
        changePercentage: 0,
      },
      alerts: [],
      topPerformers: [],
    };
  }

  // Admin methods
  async getAllProductionStats(period?: string) {
    const dateFilter = this.getDateFilter(period);
    
    const records = await this.prisma.productionRecord.findMany({
      where: {
        date: dateFilter,
      },
    });

    const recordTypes = records.reduce((acc, record) => {
      const data = record.data as any;
      acc[record.recordType] = (acc[record.recordType] || 0) + (data?.quantity || 0);
      return acc;
    }, {} as Record<string, number>);

    const userStats = records.reduce((acc, record) => {
      const userId = record.userId;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          totalProduction: 0,
          recordCount: 0,
          recordTypes: {},
        };
      }
      const data = record.data as any;
      acc[userId].totalProduction += (data?.quantity || 0);
      acc[userId].recordCount += 1;
      acc[userId].recordTypes[record.recordType] = 
        (acc[userId].recordTypes[record.recordType] || 0) + (data?.quantity || 0);
      return acc;
    }, {} as Record<string, any>);

    return {
      totalRecords: records.length,
      recordTypes,
      userStats: Object.values(userStats),
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

  // Missing methods required by resolver

  // Mortality record methods
  async createMortalityRecord(userId: string, input: CreateMortalityRecordInputType) {
    return this.createProductionRecord(userId, {
      farmId: input.farmId,
      houseId: input.houseId,
      recordType: 'mortality',
      date: input.deathDate,
      quantity: input.deadChickens,
      unit: 'chickens',
      notes: input.notes,
      data: JSON.stringify({
        chickenType: input.chickenType,
        totalChickens: input.totalChickens,
        deadChickens: input.deadChickens,
        causeOfDeath: input.causeOfDeath,
        suspectedDisease: input.suspectedDisease,
        ageInWeeks: input.ageInWeeks,
        weight: input.weight,
        symptoms: input.symptoms,
        veterinarianDiagnosis: input.veterinarianDiagnosis,
        preventiveMeasures: input.preventiveMeasures,
        cost: input.cost,
      }),
    });
  }

  async updateMortalityRecord(id: string, userId: string, input: UpdateMortalityRecordInputType) {
    const updateData: any = {
      recordType: 'mortality',
      data: JSON.stringify({
        chickenType: input.chickenType,
        totalChickens: input.totalChickens,
        deadChickens: input.deadChickens,
        causeOfDeath: input.causeOfDeath,
        suspectedDisease: input.suspectedDisease,
        ageInWeeks: input.ageInWeeks,
        weight: input.weight,
        symptoms: input.symptoms,
        veterinarianDiagnosis: input.veterinarianDiagnosis,
        preventiveMeasures: input.preventiveMeasures,
        cost: input.cost,
      }),
    };
    
    if (input.deathDate) {
      updateData.date = input.deathDate;
    }
    
    if (input.farmId) updateData.farmId = input.farmId;
    if (input.houseId) updateData.houseId = input.houseId;
    if (input.deadChickens) updateData.quantity = input.deadChickens;
    if (input.notes) updateData.notes = input.notes;
    
    return this.updateProductionRecord(id, userId, updateData);
  }

  async deleteMortalityRecord(id: string, userId: string) {
    return this.deleteProductionRecord(id, userId);
  }

  // Weight record methods
  async createWeightRecord(userId: string, input: CreateWeightRecordInputType) {
    return this.createProductionRecord(userId, {
      farmId: input.farmId,
      houseId: input.houseId,
      recordType: 'weight_gain',
      date: input.weighingDate,
      quantity: input.averageWeight,
      unit: 'kg',
      notes: input.notes,
      data: JSON.stringify({
        chickenType: input.chickenType,
        chickenCount: input.chickenCount,
        ageInWeeks: input.ageInWeeks,
        averageWeight: input.averageWeight,
        minWeight: input.minWeight,
        maxWeight: input.maxWeight,
        totalWeight: input.totalWeight,
        weightGain: input.weightGain,
        targetWeight: input.targetWeight,
        feedConversionRatio: input.feedConversionRatio,
      }),
    });
  }

  async updateWeightRecord(id: string, userId: string, input: UpdateWeightRecordInputType) {
    const updateData: any = {
      recordType: 'weight_gain',
      data: JSON.stringify({
        chickenType: input.chickenType,
        chickenCount: input.chickenCount,
        ageInWeeks: input.ageInWeeks,
        averageWeight: input.averageWeight,
        minWeight: input.minWeight,
        maxWeight: input.maxWeight,
        totalWeight: input.totalWeight,
        weightGain: input.weightGain,
        targetWeight: input.targetWeight,
        feedConversionRatio: input.feedConversionRatio,
      }),
    };
    
    if (input.weighingDate) {
      updateData.date = input.weighingDate;
    }
    
    if (input.farmId) updateData.farmId = input.farmId;
    if (input.houseId) updateData.houseId = input.houseId;
    if (input.averageWeight) updateData.quantity = input.averageWeight;
    if (input.notes) updateData.notes = input.notes;
    
    return this.updateProductionRecord(id, userId, updateData);
  }

  async deleteWeightRecord(id: string, userId: string) {
    return this.deleteProductionRecord(id, userId);
  }

  // Additional missing methods
  async getMortalityRecords(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    return this.getProductionRecords(userId, farmId, houseId, 'mortality', startDate, endDate);
  }

  async getWeightRecords(userId: string, farmId?: string, houseId?: string, chickenType?: string, startDate?: Date, endDate?: Date) {
    return this.getProductionRecords(userId, farmId, houseId, 'weight_gain', startDate, endDate);
  }

  // Egg production methods
  async createEggProduction(userId: string, input: CreateEggProductionInputType) {
    return this.createProductionRecord(userId, {
      farmId: input.farmId,
      houseId: input.houseId,
      recordType: 'eggs_produced',
      date: input.productionDate,
      quantity: input.totalEggs,
      unit: 'eggs',
      notes: input.notes,
      data: JSON.stringify({
        chickenType: input.chickenType,
        layingHens: input.layingHens,
        totalEggs: input.totalEggs,
        gradeAEggs: input.gradeAEggs,
        gradeBEggs: input.gradeBEggs,
        gradeCEggs: input.gradeCEggs,
        brokenEggs: input.brokenEggs,
        averageEggWeight: input.averageEggWeight,
        totalWeight: input.totalWeight,
        layingRate: input.layingRate,
        sellingPricePerDozen: input.sellingPricePerDozen,
        cost: input.cost,
      }),
    });
  }

  async updateEggProduction(id: string, userId: string, input: UpdateEggProductionInputType) {
    const updateData: any = {
      recordType: 'eggs_produced',
      data: JSON.stringify({
        chickenType: input.chickenType,
        layingHens: input.layingHens,
        totalEggs: input.totalEggs,
        gradeAEggs: input.gradeAEggs,
        gradeBEggs: input.gradeBEggs,
        gradeCEggs: input.gradeCEggs,
        brokenEggs: input.brokenEggs,
        averageEggWeight: input.averageEggWeight,
        totalWeight: input.totalWeight,
        layingRate: input.layingRate,
        sellingPricePerDozen: input.sellingPricePerDozen,
        cost: input.cost,
      }),
    };
    
    if (input.productionDate) {
      updateData.date = input.productionDate;
    }
    
    if (input.farmId) updateData.farmId = input.farmId;
    if (input.houseId) updateData.houseId = input.houseId;
    if (input.totalEggs) updateData.quantity = input.totalEggs;
    if (input.notes) updateData.notes = input.notes;
    
    return this.updateProductionRecord(id, userId, updateData);
  }

  async deleteEggProduction(id: string, userId: string) {
    return this.deleteProductionRecord(id, userId);
  }

  // Chick hatching methods
  async createChickHatching(userId: string, input: CreateChickHatchingInputType) {
    return this.createProductionRecord(userId, {
      farmId: input.farmId,
      houseId: input.houseId,
      recordType: 'chicks_hatched',
      date: input.hatchDate,
      quantity: input.hatchedChicks,
      unit: 'chicks',
      notes: input.notes,
      data: JSON.stringify({
        incubatorId: input.incubatorId,
        eggType: input.eggType,
        totalEggsSet: input.totalEggsSet,
        fertileEggs: input.fertileEggs,
        hatchedChicks: input.hatchedChicks,
        unhatchedEggs: input.unhatchedEggs,
        weakChicks: input.weakChicks,
        normalChicks: input.normalChicks,
        chickType: input.chickType,
        costPerChick: input.costPerChick,
        totalCost: input.totalCost,
        sellingPricePerChick: input.sellingPricePerChick,
      }),
    });
  }

  async updateChickHatching(id: string, userId: string, input: UpdateChickHatchingInputType) {
    const updateData: any = {
      recordType: 'chicks_hatched',
      data: JSON.stringify({
        incubatorId: input.incubatorId,
        eggType: input.eggType,
        totalEggsSet: input.totalEggsSet,
        fertileEggs: input.fertileEggs,
        hatchedChicks: input.hatchedChicks,
        unhatchedEggs: input.unhatchedEggs,
        weakChicks: input.weakChicks,
        normalChicks: input.normalChicks,
        chickType: input.chickType,
        costPerChick: input.costPerChick,
        totalCost: input.totalCost,
        sellingPricePerChick: input.sellingPricePerChick,
      }),
    };
    
    if (input.hatchDate) {
      updateData.date = input.hatchDate;
    }
    
    if (input.farmId) updateData.farmId = input.farmId;
    if (input.houseId) updateData.houseId = input.houseId;
    if (input.hatchedChicks) updateData.quantity = input.hatchedChicks;
    if (input.notes) updateData.notes = input.notes;
    
    return this.updateProductionRecord(id, userId, updateData);
  }

  async deleteChickHatching(id: string, userId: string) {
    return this.deleteProductionRecord(id, userId);
  }

  // Stats methods with additional parameters
  async getEggProductionStats(userId: string, farmId?: string, houseId?: string, startDate?: Date, endDate?: Date) {
    const result = await this.getEggProduction(userId, farmId, houseId, startDate, endDate);
    return {
      totalEggs: result.totalEggs,
      gradeAEggs: 0,
      gradeBEggs: 0,
      gradeCEggs: 0,
      averageEggWeight: 0,
      layingRate: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      monthlyTrend: [],
    };
  }

  async getAdminProductionStats(region?: string, district?: string) {
    return this.getAllProductionStats();
  }
}
