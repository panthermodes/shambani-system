import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProductionService } from './production.service';
import { CreateProductionRecordDto } from './dto/create-production-record.dto';
import { UpdateProductionRecordDto } from './dto/update-production-record.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ProductionRecordType,
  EggProductionType,
  ChickHatchingType,
  MortalityRecordType,
  WeightRecordType,
  ProductionStatsType,
  EggProductionStatsType,
  ChickHatchingStatsType,
  MortalityStatsType,
  WeightGainStatsType,
  ProductionDashboardType,
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

// Define input types if needed (replace any with actual DTOs when available)
interface EggProductionInput {
  date?: Date;
  houseId?: string;
  quantity: number;
  quality?: string;
  batch?: string;
  notes?: string;
}

interface ChickHatchingInput {
  date?: Date;
  houseId?: string;
  quantity: number;
  batch?: string;
  notes?: string;
}

interface MortalityInput {
  date?: Date;
  houseId?: string;
  quantity: number;
  cause?: string;
  notes?: string;
}

interface WeightInput {
  date?: Date;
  houseId?: string;
  weight: number;
  chickenType?: string;
  sampleSize?: number;
  notes?: string;
}

@Resolver()
export class ProductionResolver {
  constructor(private readonly productionService: ProductionService) {}

  // ==================== QUERIES ====================

  @Query(() => [ProductionRecordType], { name: 'getProductionRecords' })
  @UseGuards(GqlAuthGuard)
  async getProductionRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('productionType', { nullable: true }) productionType: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getProductionRecords(
      userId, farmId, houseId, productionType, startDate, endDate
    );
  }

  @Query(() => ProductionRecordType, { name: 'getProductionRecord' })
  @UseGuards(GqlAuthGuard)
  async getProductionRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.productionService.getProductionRecord(id, userId);
  }

  @Query(() => [EggProductionType], { name: 'getEggProduction' })
  @UseGuards(GqlAuthGuard)
  async getEggProduction(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getEggProduction(
      userId, farmId, houseId, startDate, endDate
    );
  }

  @Query(() => [ChickHatchingType], { name: 'getChickHatching' })
  @UseGuards(GqlAuthGuard)
  async getChickHatching(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getChickHatching(
      userId, farmId, houseId, startDate, endDate
    );
  }

  @Query(() => [MortalityRecordType], { name: 'getMortalityRecords' })
  @UseGuards(GqlAuthGuard)
  async getMortalityRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getMortalityRecords(
      userId, farmId, houseId, startDate, endDate
    );
  }

  @Query(() => [WeightRecordType], { name: 'getWeightRecords' })
  @UseGuards(GqlAuthGuard)
  async getWeightRecords(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('chickenType', { nullable: true }) chickenType: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getWeightRecords(
      userId, farmId, houseId, chickenType, startDate, endDate
    );
  }

  @Query(() => ProductionStatsType, { name: 'getProductionStats' })
  @UseGuards(GqlAuthGuard)
  async getProductionStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getProductionStats(
      userId, farmId, houseId, startDate, endDate
    );
  }

  @Query(() => MortalityStatsType, { name: 'getMortalityStats' })
  @UseGuards(GqlAuthGuard)
  async getMortalityStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getMortalityStats(
      userId, farmId, houseId, startDate, endDate
    );
  }

  @Query(() => WeightGainStatsType, { name: 'getWeightGainStats' })
  @UseGuards(GqlAuthGuard)
  async getWeightGainStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('chickenType', { nullable: true }) chickenType: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getWeightGainStats(
      userId, farmId, houseId, chickenType, startDate, endDate
    );
  }

  @Query(() => ChickHatchingStatsType, { name: 'getChickHatchingStats' })
  @UseGuards(GqlAuthGuard)
  async getChickHatchingStats(
    @Args('farmId', { nullable: true }) farmId: string,
    @Args('houseId', { nullable: true }) houseId: string,
    @Args('startDate', { nullable: true }) startDate: Date,
    @Args('endDate', { nullable: true }) endDate: Date,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getChickHatchingStats(
      userId, farmId, houseId, startDate, endDate
    );
  }

  @Query(() => ProductionDashboardType, { name: 'getProductionDashboard' })
  @UseGuards(GqlAuthGuard)
  async getProductionDashboard(
    @Args('period', { nullable: true }) period: string,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.getProductionDashboard(userId, period);
  }

  @Query(() => EggProductionStatsType, { name: 'getEggProductionStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAllProductionStats(
    @Args('period', { nullable: true }) period: string
  ) {
    return this.productionService.getAllProductionStats(period);
  }

  @Query(() => ProductionStatsType, { name: 'getAdminProductionStats' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdminProductionStats(
    @Args('region', { nullable: true }) region: string,
    @Args('district', { nullable: true }) district: string
  ) {
    // This is a stub – implement if needed
    return this.productionService.getAdminProductionStats(region, district);
  }

  // ==================== MUTATIONS ====================

  @Mutation(() => ProductionRecordType, { name: 'createProductionRecord' })
  @UseGuards(GqlAuthGuard)
  async createProductionRecord(
    @Args('input') input: CreateProductionRecordInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.createProductionRecord(userId, input);
  }

  @Mutation(() => ProductionRecordType, { name: 'updateProductionRecord' })
  @UseGuards(GqlAuthGuard)
  async updateProductionRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateProductionRecordInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.updateProductionRecord(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteProductionRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteProductionRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.productionService.deleteProductionRecord(id, userId);
  }

  @Mutation(() => EggProductionType, { name: 'createEggProduction' })
  @UseGuards(GqlAuthGuard)
  async createEggProduction(
    @Args('input') input: CreateEggProductionInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.createEggProduction(userId, input);
  }

  @Mutation(() => EggProductionType, { name: 'updateEggProduction' })
  @UseGuards(GqlAuthGuard)
  async updateEggProduction(
    @Args('id') id: string,
    @Args('input') input: UpdateEggProductionInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.updateEggProduction(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteEggProduction' })
  @UseGuards(GqlAuthGuard)
  async deleteEggProduction(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.productionService.deleteEggProduction(id, userId);
  }

  @Mutation(() => ChickHatchingType, { name: 'createChickHatching' })
  @UseGuards(GqlAuthGuard)
  async createChickHatching(
    @Args('input') input: CreateChickHatchingInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.createChickHatching(userId, input);
  }

  @Mutation(() => ChickHatchingType, { name: 'updateChickHatching' })
  @UseGuards(GqlAuthGuard)
  async updateChickHatching(
    @Args('id') id: string,
    @Args('input') input: UpdateChickHatchingInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.updateChickHatching(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteChickHatching' })
  @UseGuards(GqlAuthGuard)
  async deleteChickHatching(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.productionService.deleteChickHatching(id, userId);
  }

  @Mutation(() => MortalityRecordType, { name: 'createMortalityRecord' })
  @UseGuards(GqlAuthGuard)
  async createMortalityRecord(
    @Args('input') input: CreateMortalityRecordInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.createMortalityRecord(userId, input);
  }

  @Mutation(() => MortalityRecordType, { name: 'updateMortalityRecord' })
  @UseGuards(GqlAuthGuard)
  async updateMortalityRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateMortalityRecordInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.updateMortalityRecord(id, userId, input);
  }

  @Mutation(() => Boolean, { name: 'deleteMortalityRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteMortalityRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.productionService.deleteMortalityRecord(id, userId);
  }

  @Mutation(() => WeightRecordType, { name: 'createWeightRecord' })
  @UseGuards(GqlAuthGuard)
  async createWeightRecord(
    @Args('input') input: CreateWeightRecordInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.createWeightRecord(userId, input);
  }

  @Mutation(() => WeightRecordType, { name: 'updateWeightRecord' })
  @UseGuards(GqlAuthGuard)
  async updateWeightRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateWeightRecordInputType,
    @Context() context
  ) {
    const userId = context.req.user.id;
    return this.productionService.updateWeightRecord(id, userId, input);
  }
  @Mutation(() => Boolean, { name: 'deleteWeightRecord' })
  @UseGuards(GqlAuthGuard)
  async deleteWeightRecord(@Args('id') id: string, @Context() context) {
    const userId = context.req.user.id;
    return this.productionService.deleteWeightRecord(id, userId);
  }
}