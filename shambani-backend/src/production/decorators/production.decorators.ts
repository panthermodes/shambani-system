import { Field, ObjectType, InputType, Int, Float } from '@nestjs/graphql';

@ObjectType('ProductionRecord')
export class ProductionRecordType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  recordType: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  unit?: string;

  @Field({ nullable: true })
  quality?: string;

  @Field({ nullable: true })
  temperature?: number;

  @Field({ nullable: true })
  humidity?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  data?: String;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('EggProduction')
export class EggProductionType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  productionDate: Date;

  @Field()
  chickenType: string;

  @Field(() => Int)
  layingHens: number;

  @Field(() => Int)
  totalEggs: number;

  @Field(() => Int)
  gradeAEggs: number;

  @Field(() => Int)
  gradeBEggs: number;

  @Field(() => Int)
  gradeCEggs: number;

  @Field(() => Int)
  brokenEggs: number;

  @Field(() => Float)
  averageEggWeight: number;

  @Field(() => Float)
  totalWeight: number;

  @Field(() => Float)
  layingRate: number;

  @Field(() => Float)
  sellingPricePerDozen: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  profit: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('ChickHatching')
export class ChickHatchingType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  hatchDate: Date;

  @Field({ nullable: true })
  incubatorId?: string;

  @Field()
  eggType: string;

  @Field(() => Int)
  totalEggsSet: number;

  @Field(() => Int)
  fertileEggs: number;

  @Field(() => Int)
  hatchedChicks: number;

  @Field(() => Int)
  unhatchedEggs: number;

  @Field(() => Int)
  weakChicks: number;

  @Field(() => Int)
  normalChicks: number;

  @Field(() => Float)
  hatchRate: number;

  @Field(() => Float)
  fertilityRate: number;

  @Field(() => Float)
  mortalityRate: number;

  @Field()
  chickType: string;

  @Field(() => Float)
  costPerChick: number;

  @Field(() => Float)
  totalCost: number;

  @Field(() => Float)
  sellingPricePerChick: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  profit: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('MortalityRecord')
export class MortalityRecordType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  deathDate: Date;

  @Field()
  chickenType: string;

  @Field(() => Int)
  totalChickens: number;

  @Field(() => Int)
  deadChickens: number;

  @Field(() => Float)
  mortalityRate: number;

  @Field()
  causeOfDeath: string;

  @Field({ nullable: true })
  suspectedDisease?: string;

  @Field(() => Int)
  ageInWeeks: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  symptoms?: string;

  @Field({ nullable: true })
  veterinarianDiagnosis?: string;

  @Field({ nullable: true })
  preventiveMeasures?: string;

  @Field(() => Float)
  cost: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  metadata?: String;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('WeightRecord')
export class WeightRecordType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  weighingDate: Date;

  @Field()
  chickenType: string;

  @Field(() => Int)
  chickenCount: number;

  @Field(() => Int)
  ageInWeeks: number;

  @Field(() => Float)
  averageWeight: number;

  @Field(() => Float)
  minWeight: number;

  @Field(() => Float)
  maxWeight: number;

  @Field(() => Float)
  totalWeight: number;

  @Field(() => Float)
  weightGain: number;

  @Field(() => Float)
  weightGainRate: number;

  @Field(() => Float)
  targetWeight: number;

  @Field()
  performanceIndicator: string;

  @Field(() => Float)
  feedConversionRatio: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('ProductionStats')
export class ProductionStatsType {
  @Field(() => Int)
  totalRecords: number;

  @Field(() => Int)
  totalEggsProduced: number;

  @Field(() => Int)
  totalChicksHatched: number;

  @Field(() => Float)
  totalMeatProduced: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  totalCost: number;

  @Field(() => Float)
  totalProfit: number;

  @Field(() => Float)
  averageMortalityRate: number;

  @Field(() => Float)
  averageHatchRate: number;

  @Field(() => Float)
  averageLayingRate: number;

  @Field(() => [ProductionByTypeType])
  productionByType: ProductionByTypeType[];

  @Field(() => [MonthlyProductionType])
  monthlyProduction: MonthlyProductionType[];

  @Field(() => [FarmProductionType])
  topPerformingFarms: FarmProductionType[];

  @Field(() => [ProductionTrendDataType])
  productionTrend: ProductionTrendDataType[];
}

@ObjectType('ProductionByType')
export class ProductionByTypeType {
  @Field()
  productionType: string;

  @Field(() => Float)
  totalQuantity: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  totalCost: number;

  @Field(() => Float)
  totalProfit: number;

  @Field(() => Int)
  recordCount: number;
}

@ObjectType('MonthlyProduction')
export class MonthlyProductionType {
  @Field()
  month: string;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  eggsProduced: number;

  @Field(() => Int)
  chicksHatched: number;

  @Field(() => Float)
  meatProduced: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  profit: number;

  @Field(() => Float)
  mortalityRate: number;
}

@ObjectType('FarmProduction')
export class FarmProductionType {
  @Field()
  farmId: string;

  @Field()
  farmName: string;

  @Field(() => Float)
  totalProduction: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  efficiency: number;

  @Field(() => Int)
  rank: number;
}

@ObjectType('ProductionTrendData')
export class ProductionTrendDataType {
  @Field()
  date: string;

  @Field(() => Float)
  production: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  efficiency: number;
}

@ObjectType('EggProductionStats')
export class EggProductionStatsType {
  @Field(() => Int)
  totalEggs: number;

  @Field(() => Int)
  gradeAEggs: number;

  @Field(() => Int)
  gradeBEggs: number;

  @Field(() => Int)
  gradeCEggs: number;

  @Field(() => Float)
  averageEggWeight: number;

  @Field(() => Float)
  layingRate: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  profit: number;

  @Field(() => [MonthlyEggTrendType])
  monthlyTrend: MonthlyEggTrendType[];
}

@ObjectType('ChickHatchingStats')
export class ChickHatchingStatsType {
  @Field(() => Int)
  totalEggsSet: number;

  @Field(() => Int)
  totalChicksHatched: number;

  @Field(() => Float)
  hatchRate: number;

  @Field(() => Float)
  fertilityRate: number;

  @Field(() => Float)
  mortalityRate: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  profit: number;

  @Field(() => [MonthlyHatchTrendType])
  monthlyTrend: MonthlyHatchTrendType[];
}

@ObjectType('MortalityStats')
export class MortalityStatsType {
  @Field(() => Int)
  totalDeaths: number;

  @Field(() => Float)
  averageMortalityRate: number;

  @Field(() => [DeathByCauseType])
  deathsByCause: DeathByCauseType[];

  @Field(() => [DeathByAgeType])
  deathsByAge: DeathByAgeType[];

  @Field(() => Float)
  costOfMortality: number;

  @Field(() => [MonthlyMortalityTrendType])
  monthlyTrend: MonthlyMortalityTrendType[];
}

@ObjectType('WeightGainStats')
export class WeightGainStatsType {
  @Field(() => Float)
  averageWeightGain: number;

  @Field(() => Float)
  averageFeedConversionRatio: number;

  @Field(() => [PerformanceDistributionType])
  performanceDistribution: PerformanceDistributionType[];

  @Field(() => [WeightByAgeType])
  weightByAge: WeightByAgeType[];

  @Field(() => Float)
  targetAchievement: number;
}

@ObjectType('TodayProduction')
export class TodayProductionType {
  @Field(() => Int)
  eggsProduced: number;

  @Field(() => Int)
  chicksHatched: number;

  @Field(() => Int)
  currentMortality: number;

  @Field(() => Float)
  revenue: number;
}

@ObjectType('WeeklyData')
export class WeeklyDataType {
  @Field(() => Float)
  production: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  profit: number;
}

@ObjectType('MonthlyData')
export class MonthlyDataType {
  @Field(() => Float)
  production: number;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  profit: number;
}

@ObjectType('WeeklyComparison')
export class WeeklyComparisonType {
  @Field(() => WeeklyDataType)
  thisWeek: WeeklyDataType;

  @Field(() => WeeklyDataType)
  lastWeek: WeeklyDataType;

  @Field(() => Float)
  changePercentage: number;
}

@ObjectType('MonthlyOverview')
export class MonthlyOverviewType {
  @Field(() => MonthlyDataType)
  currentMonth: MonthlyDataType;

  @Field(() => MonthlyDataType)
  lastMonth: MonthlyDataType;

  @Field(() => Float)
  changePercentage: number;
}

@ObjectType('ProductionAlert')
export class ProductionAlertType {
  @Field()
  type: string;

  @Field()
  message: string;

  @Field()
  severity: string;

  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;
}

@ObjectType('TopPerformer')
export class TopPerformerType {
  @Field()
  category: string;

  @Field()
  farmName: string;

  @Field(() => Float)
  value: number;

  @Field()
  unit: string;
}

@ObjectType('ProductionDashboard')
export class ProductionDashboardType {
  @Field(() => TodayProductionType)
  todayProduction: TodayProductionType;

  @Field(() => WeeklyComparisonType)
  weeklyComparison: WeeklyComparisonType;

  @Field(() => MonthlyOverviewType)
  monthlyOverview: MonthlyOverviewType;

  @Field(() => [ProductionAlertType])
  alerts: ProductionAlertType[];

  @Field(() => [TopPerformerType])
  topPerformers: TopPerformerType[];
}

@ObjectType('MonthlyEggTrend')
export class MonthlyEggTrendType {
  @Field()
  month: string;

  @Field(() => Int)
  eggsProduced: number;

  @Field(() => Float)
  layingRate: number;

  @Field(() => Float)
  revenue: number;
}

@ObjectType('MonthlyHatchTrend')
export class MonthlyHatchTrendType {
  @Field()
  month: string;

  @Field(() => Int)
  chicksHatched: number;

  @Field(() => Float)
  hatchRate: number;

  @Field(() => Float)
  revenue: number;
}

@ObjectType('MonthlyMortalityTrend')
export class MonthlyMortalityTrendType {
  @Field()
  month: string;

  @Field(() => Int)
  deaths: number;

  @Field(() => Float)
  mortalityRate: number;

  @Field(() => Float)
  cost: number;
}

@ObjectType('DeathByCause')
export class DeathByCauseType {
  @Field()
  cause: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType('DeathByAge')
export class DeathByAgeType {
  @Field()
  ageGroup: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType('PerformanceDistribution')
export class PerformanceDistributionType {
  @Field()
  performance: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType('WeightByAge')
export class WeightByAgeType {
  @Field(() => Int)
  ageInWeeks: number;

  @Field(() => Float)
  averageWeight: number;

  @Field(() => Float)
  targetWeight: number;
}

// Input Types
@InputType('CreateProductionRecordInput')
export class CreateProductionRecordInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  productionType: string;

  @Field({ nullable: true })
  chickenType?: string;

  @Field({ nullable: true })
  chickenCount?: number;

  @Field()
  productionDate: Date;

  @Field()
  quantity: number;

  @Field()
  unit: string;

  @Field({ nullable: true })
  quality?: string;

  @Field({ nullable: true })
  weightPerUnit?: number;

  @Field({ nullable: true })
  totalWeight?: number;

  @Field({ nullable: true })
  hatchRate?: number;

  @Field({ nullable: true })
  fertilityRate?: number;

  @Field({ nullable: true })
  mortalityRate?: number;

  @Field({ nullable: true })
  sellingPrice?: number;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('UpdateProductionRecordInput')
export class UpdateProductionRecordInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field({ nullable: true })
  productionType?: string;

  @Field({ nullable: true })
  chickenType?: string;

  @Field({ nullable: true })
  chickenCount?: number;

  @Field({ nullable: true })
  productionDate?: Date;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  unit?: string;

  @Field({ nullable: true })
  quality?: string;

  @Field({ nullable: true })
  weightPerUnit?: number;

  @Field({ nullable: true })
  totalWeight?: number;

  @Field({ nullable: true })
  hatchRate?: number;

  @Field({ nullable: true })
  fertilityRate?: number;

  @Field({ nullable: true })
  mortalityRate?: number;

  @Field({ nullable: true })
  sellingPrice?: number;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('CreateEggProductionInput')
export class CreateEggProductionInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  productionDate: Date;

  @Field()
  chickenType: string;

  @Field(() => Int)
  layingHens: number;

  @Field(() => Int)
  totalEggs: number;

  @Field(() => Int)
  gradeAEggs: number;

  @Field(() => Int)
  gradeBEggs: number;

  @Field(() => Int)
  gradeCEggs: number;

  @Field(() => Int)
  brokenEggs: number;

  @Field(() => Float)
  averageEggWeight: number;

  @Field(() => Float)
  totalWeight: number;

  @Field(() => Float)
  layingRate: number;

  @Field(() => Float)
  sellingPricePerDozen: number;

  @Field(() => Float)
  cost: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('UpdateEggProductionInput')
export class UpdateEggProductionInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field({ nullable: true })
  productionDate?: Date;

  @Field({ nullable: true })
  chickenType?: string;

  @Field({ nullable: true })
  layingHens?: number;

  @Field({ nullable: true })
  totalEggs?: number;

  @Field({ nullable: true })
  gradeAEggs?: number;

  @Field({ nullable: true })
  gradeBEggs?: number;

  @Field({ nullable: true })
  gradeCEggs?: number;

  @Field({ nullable: true })
  brokenEggs?: number;

  @Field({ nullable: true })
  averageEggWeight?: number;

  @Field({ nullable: true })
  totalWeight?: number;

  @Field({ nullable: true })
  layingRate?: number;

  @Field({ nullable: true })
  sellingPricePerDozen?: number;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('CreateChickHatchingInput')
export class CreateChickHatchingInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  hatchDate: Date;

  @Field({ nullable: true })
  incubatorId?: string;

  @Field()
  eggType: string;

  @Field(() => Int)
  totalEggsSet: number;

  @Field(() => Int)
  fertileEggs: number;

  @Field(() => Int)
  hatchedChicks: number;

  @Field(() => Int)
  unhatchedEggs: number;

  @Field(() => Int)
  weakChicks: number;

  @Field(() => Int)
  normalChicks: number;

  @Field()
  chickType: string;

  @Field(() => Float)
  costPerChick: number;

  @Field(() => Float)
  totalCost: number;

  @Field(() => Float)
  sellingPricePerChick: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('UpdateChickHatchingInput')
export class UpdateChickHatchingInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field({ nullable: true })
  hatchDate?: Date;

  @Field({ nullable: true })
  incubatorId?: string;

  @Field({ nullable: true })
  eggType?: string;

  @Field({ nullable: true })
  totalEggsSet?: number;

  @Field({ nullable: true })
  fertileEggs?: number;

  @Field({ nullable: true })
  hatchedChicks?: number;

  @Field({ nullable: true })
  unhatchedEggs?: number;

  @Field({ nullable: true })
  weakChicks?: number;

  @Field({ nullable: true })
  normalChicks?: number;

  @Field({ nullable: true })
  chickType?: string;

  @Field({ nullable: true })
  costPerChick?: number;

  @Field({ nullable: true })
  totalCost?: number;

  @Field({ nullable: true })
  sellingPricePerChick?: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('CreateMortalityRecordInput')
export class CreateMortalityRecordInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  deathDate: Date;

  @Field()
  chickenType: string;

  @Field(() => Int)
  totalChickens: number;

  @Field(() => Int)
  deadChickens: number;

  @Field()
  causeOfDeath: string;

  @Field({ nullable: true })
  suspectedDisease?: string;

  @Field(() => Int)
  ageInWeeks: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  symptoms?: string;

  @Field({ nullable: true })
  veterinarianDiagnosis?: string;

  @Field({ nullable: true })
  preventiveMeasures?: string;

  @Field(() => Float)
  cost: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('UpdateMortalityRecordInput')
export class UpdateMortalityRecordInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field({ nullable: true })
  deathDate?: Date;

  @Field({ nullable: true })
  chickenType?: string;

  @Field({ nullable: true })
  totalChickens?: number;

  @Field({ nullable: true })
  deadChickens?: number;

  @Field({ nullable: true })
  causeOfDeath?: string;

  @Field({ nullable: true })
  suspectedDisease?: string;

  @Field({ nullable: true })
  ageInWeeks?: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  symptoms?: string;

  @Field({ nullable: true })
  veterinarianDiagnosis?: string;

  @Field({ nullable: true })
  preventiveMeasures?: string;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('CreateWeightRecordInput')
export class CreateWeightRecordInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field()
  weighingDate: Date;

  @Field()
  chickenType: string;

  @Field(() => Int)
  chickenCount: number;

  @Field(() => Int)
  ageInWeeks: number;

  @Field(() => Float)
  averageWeight: number;

  @Field(() => Float)
  minWeight: number;

  @Field(() => Float)
  maxWeight: number;

  @Field(() => Float)
  totalWeight: number;

  @Field(() => Float)
  weightGain: number;

  @Field(() => Float)
  targetWeight: number;

  @Field(() => Float)
  feedConversionRatio: number;

  @Field({ nullable: true })
  notes?: string;
}

@InputType('UpdateWeightRecordInput')
export class UpdateWeightRecordInputType {
  @Field({ nullable: true })
  farmId?: string;

  @Field({ nullable: true })
  houseId?: string;

  @Field({ nullable: true })
  weighingDate?: Date;

  @Field({ nullable: true })
  chickenType?: string;

  @Field({ nullable: true })
  chickenCount?: number;

  @Field({ nullable: true })
  ageInWeeks?: number;

  @Field({ nullable: true })
  averageWeight?: number;

  @Field({ nullable: true })
  minWeight?: number;

  @Field({ nullable: true })
  maxWeight?: number;

  @Field({ nullable: true })
  totalWeight?: number;

  @Field({ nullable: true })
  weightGain?: number;

  @Field({ nullable: true })
  targetWeight?: number;

  @Field({ nullable: true })
  feedConversionRatio?: number;

  @Field({ nullable: true })
  notes?: string;
}
