export interface ProductionRecord {
  id: string;
  userId: string;
  farmId?: string;
  houseId?: string;
  recordType: string;
  date: Date;
  quantity?: number;
  unit?: string;
  quality?: string;
  temperature?: number;
  humidity?: number;
  notes?: string;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface EggProduction {
  id: string;
  userId: string;
  farmId?: string;
  houseId?: string;
  productionDate: Date;
  chickenType: string;
  layingHens: number;
  totalEggs: number;
  gradeAEggs: number;
  gradeBEggs: number;
  gradeCEggs: number;
  brokenEggs: number;
  averageEggWeight: number;
  totalWeight: number;
  layingRate: number;
  sellingPricePerDozen: number;
  revenue: number;
  cost: number;
  profit: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChickHatching {
  id: string;
  userId: string;
  farmId?: string;
  houseId?: string;
  hatchDate: Date;
  incubatorId?: string;
  eggType: string;
  totalEggsSet: number;
  fertileEggs: number;
  hatchedChicks: number;
  unhatchedEggs: number;
  weakChicks: number;
  normalChicks: number;
  hatchRate: number;
  fertilityRate: number;
  mortalityRate: number;
  chickType: string;
  costPerChick: number;
  totalCost: number;
  sellingPricePerChick: number;
  revenue: number;
  profit: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MortalityRecord {
  id: string;
  userId: string;
  farmId?: string;
  houseId?: string;
  deathDate: Date;
  chickenType: string;
  totalChickens: number;
  deadChickens: number;
  mortalityRate: number;
  causeOfDeath: string;
  suspectedDisease?: string;
  ageInWeeks: number;
  weight?: number;
  symptoms?: string;
  veterinarianDiagnosis?: string;
  preventiveMeasures?: string;
  cost: number;
  notes?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightRecord {
  id: string;
  userId: string;
  farmId?: string;
  houseId?: string;
  weighingDate: Date;
  chickenType: string;
  chickenCount: number;
  ageInWeeks: number;
  averageWeight: number;
  minWeight: number;
  maxWeight: number;
  totalWeight: number;
  weightGain: number;
  weightGainRate: number;
  targetWeight: number;
  performanceIndicator: string;
  feedConversionRatio: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionStats {
  totalProductionRecords: number;
  totalEggsProduced: number;
  totalChicksHatched: number;
  totalMeatProduced: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageMortalityRate: number;
  averageHatchRate: number;
  averageLayingRate: number;
  productionByType: ProductionByType[];
  monthlyProduction: MonthlyProduction[];
  topPerformingFarms: FarmProduction[];
  productionTrend: ProductionTrendData[];
}

export interface ProductionByType {
  productionType: string;
  totalQuantity: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  recordCount: number;
}

export interface MonthlyProduction {
  month: string;
  year: number;
  eggsProduced: number;
  chicksHatched: number;
  meatProduced: number;
  revenue: number;
  cost: number;
  profit: number;
  mortalityRate: number;
}

export interface FarmProduction {
  farmId: string;
  farmName: string;
  totalProduction: number;
  totalRevenue: number;
  efficiency: number;
  rank: number;
}

export interface ProductionTrendData {
  date: string;
  production: number;
  revenue: number;
  efficiency: number;
}

export interface EggProductionStats {
  totalEggs: number;
  gradeAEggs: number;
  gradeBEggs: number;
  gradeCEggs: number;
  averageEggWeight: number;
  layingRate: number;
  revenue: number;
  cost: number;
  profit: number;
  monthlyTrend: MonthlyEggTrend[];
}

export interface ChickHatchingStats {
  totalEggsSet: number;
  totalChicksHatched: number;
  hatchRate: number;
  fertilityRate: number;
  mortalityRate: number;
  revenue: number;
  cost: number;
  profit: number;
  monthlyTrend: MonthlyHatchTrend[];
}

export interface MortalityStats {
  totalDeaths: number;
  averageMortalityRate: number;
  deathsByCause: DeathByCause[];
  deathsByAge: DeathByAge[];
  costOfMortality: number;
  monthlyTrend: MonthlyMortalityTrend[];
}

export interface WeightGainStats {
  averageWeightGain: number;
  averageFeedConversionRatio: number;
  performanceDistribution: PerformanceDistribution[];
  weightByAge: WeightByAge[];
  targetAchievement: number;
}

export interface ProductionDashboard {
  todayProduction: TodayProduction;
  weeklyComparison: WeeklyComparison;
  monthlyOverview: MonthlyOverview;
  alerts: ProductionAlert[];
  topPerformers: TopPerformer[];
}

export interface TodayProduction {
  eggsProduced: number;
  chicksHatched: number;
  currentMortality: number;
  revenue: number;
}

export interface WeeklyComparison {
  thisWeek: WeeklyData;
  lastWeek: WeeklyData;
  changePercentage: number;
}

export interface MonthlyOverview {
  currentMonth: MonthlyData;
  lastMonth: MonthlyData;
  changePercentage: number;
}

export interface ProductionAlert {
  type: string;
  message: string;
  severity: string;
  farmId?: string;
  houseId?: string;
}

export interface TopPerformer {
  category: string;
  farmName: string;
  value: number;
  unit: string;
}

export interface MonthlyEggTrend {
  month: string;
  eggsProduced: number;
  layingRate: number;
  revenue: number;
}

export interface MonthlyHatchTrend {
  month: string;
  chicksHatched: number;
  hatchRate: number;
  revenue: number;
}

export interface MonthlyMortalityTrend {
  month: string;
  deaths: number;
  mortalityRate: number;
  cost: number;
}

export interface DeathByCause {
  cause: string;
  count: number;
  percentage: number;
}

export interface DeathByAge {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface PerformanceDistribution {
  performance: string;
  count: number;
  percentage: number;
}

export interface WeightByAge {
  ageInWeeks: number;
  averageWeight: number;
  targetWeight: number;
}

export interface WeeklyData {
  production: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface MonthlyData {
  production: number;
  revenue: number;
  cost: number;
  profit: number;
}

// GraphQL Input Types
export interface CreateProductionRecordInput {
  farmId?: string;
  houseId?: string;
  productionType: string;
  chickenType?: string;
  chickenCount?: number;
  productionDate: Date;
  quantity: number;
  unit: string;
  quality?: string;
  weightPerUnit?: number;
  totalWeight?: number;
  hatchRate?: number;
  fertilityRate?: number;
  mortalityRate?: number;
  sellingPrice?: number;
  cost?: number;
  notes?: string;
}

export interface UpdateProductionRecordInput {
  farmId?: string;
  houseId?: string;
  productionType?: string;
  chickenType?: string;
  chickenCount?: number;
  productionDate?: Date;
  quantity?: number;
  unit?: string;
  quality?: string;
  weightPerUnit?: number;
  totalWeight?: number;
  hatchRate?: number;
  fertilityRate?: number;
  mortalityRate?: number;
  sellingPrice?: number;
  cost?: number;
  notes?: string;
}

export interface CreateEggProductionInput {
  farmId?: string;
  houseId?: string;
  productionDate: Date;
  chickenType: string;
  layingHens: number;
  totalEggs: number;
  gradeAEggs: number;
  gradeBEggs: number;
  gradeCEggs: number;
  brokenEggs: number;
  averageEggWeight: number;
  totalWeight: number;
  layingRate: number;
  sellingPricePerDozen: number;
  cost: number;
  notes?: string;
}

export interface UpdateEggProductionInput {
  farmId?: string;
  houseId?: string;
  productionDate?: Date;
  chickenType?: string;
  layingHens?: number;
  totalEggs?: number;
  gradeAEggs?: number;
  gradeBEggs?: number;
  gradeCEggs?: number;
  brokenEggs?: number;
  averageEggWeight?: number;
  totalWeight?: number;
  layingRate?: number;
  sellingPricePerDozen?: number;
  cost?: number;
  notes?: string;
}

export interface CreateChickHatchingInput {
  farmId?: string;
  houseId?: string;
  hatchDate: Date;
  incubatorId?: string;
  eggType: string;
  totalEggsSet: number;
  fertileEggs: number;
  hatchedChicks: number;
  unhatchedEggs: number;
  weakChicks: number;
  normalChicks: number;
  chickType: string;
  costPerChick: number;
  totalCost: number;
  sellingPricePerChick: number;
  notes?: string;
}

export interface UpdateChickHatchingInput {
  farmId?: string;
  houseId?: string;
  hatchDate?: Date;
  incubatorId?: string;
  eggType?: string;
  totalEggsSet?: number;
  fertileEggs?: number;
  hatchedChicks?: number;
  unhatchedEggs?: number;
  weakChicks?: number;
  normalChicks?: number;
  chickType?: string;
  costPerChick?: number;
  totalCost?: number;
  sellingPricePerChick?: number;
  notes?: string;
}

export interface CreateMortalityRecordInput {
  farmId?: string;
  houseId?: string;
  deathDate: Date;
  chickenType: string;
  totalChickens: number;
  deadChickens: number;
  causeOfDeath: string;
  suspectedDisease?: string;
  ageInWeeks: number;
  weight?: number;
  symptoms?: string;
  veterinarianDiagnosis?: string;
  preventiveMeasures?: string;
  cost: number;
  notes?: string;
}

export interface UpdateMortalityRecordInput {
  farmId?: string;
  houseId?: string;
  deathDate?: Date;
  chickenType?: string;
  totalChickens?: number;
  deadChickens?: number;
  causeOfDeath?: string;
  suspectedDisease?: string;
  ageInWeeks?: number;
  weight?: number;
  symptoms?: string;
  veterinarianDiagnosis?: string;
  preventiveMeasures?: string;
  cost?: number;
  notes?: string;
}

export interface CreateWeightRecordInput {
  farmId?: string;
  houseId?: string;
  weighingDate: Date;
  chickenType: string;
  chickenCount: number;
  ageInWeeks: number;
  averageWeight: number;
  minWeight: number;
  maxWeight: number;
  totalWeight: number;
  weightGain: number;
  targetWeight: number;
  feedConversionRatio: number;
  notes?: string;
}

export interface UpdateWeightRecordInput {
  farmId?: string;
  houseId?: string;
  weighingDate?: Date;
  chickenType?: string;
  chickenCount?: number;
  ageInWeeks?: number;
  averageWeight?: number;
  minWeight?: number;
  maxWeight?: number;
  totalWeight?: number;
  weightGain?: number;
  targetWeight?: number;
  feedConversionRatio?: number;
  notes?: string;
}
