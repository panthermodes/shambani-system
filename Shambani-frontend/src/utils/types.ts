// Type definitions matching Shambani backend schema

// ========== USER ROLES ==========
export const USER_ROLE = {
  FARMER: 'FARMER',
  CASUAL_LABOURER: 'CASUAL_LABOURER',
  EXTENSION_OFFICER: 'EXTENSION_OFFICER',
  LOGISTICS_PROVIDER: 'LOGISTICS_PROVIDER',
  AGROVET_OWNER: 'AGROVET_OWNER',
  MACHINERY_DEALER: 'MACHINERY_DEALER',
  BUYER_AGGREGATOR: 'BUYER_AGGREGATOR',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

// ========== USER SCHEMA ==========
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  farmName?: string;
  businessName?: string;
  location?: string;
  region?: string;
  district?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  orders?: Order[];
  serviceRequests?: ServiceRequest[];
  products?: Product[];
  productionRecords?: ProductionRecord[];
  feedingRecords?: FeedingRecord[];
  healthRecords?: HealthRecord[];
  financialRecords?: FinancialRecord[];
}

// ========== ORDER SCHEMA ==========
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  type: 'PRODUCT' | 'SERVICE';
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalAmount?: number;
  description?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
  items?: OrderItem[];
}

// ========== ORDER ITEM SCHEMA ==========
export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  // Relations
  order?: Order;
  product?: Product;
}

// ========== SERVICE REQUEST SCHEMA ==========
export interface ServiceRequest {
  id: string;
  userId: string;
  serviceType: 'EXTENSION' | 'LOGISTICS' | 'CONSULTATION';
  title: string;
  description: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTo?: string;
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

// ========== PRODUCT SCHEMA ==========
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity?: number;
  unit?: string;
  images: string[];
  location?: string;
  region?: string;
  district?: string;
  isActive: boolean;
  isVerified: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;

  // Relations
  seller?: User;
  orderItems?: OrderItem[];
}

// ========== NOTIFICATION SCHEMA ==========
export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

// ========== PRODUCTION RECORD SCHEMA ==========
export interface ProductionRecord {
  id: string;
  userId: string;
  recordType: 'eggs' | 'chicks' | 'mortality' | 'weight';
  date: string;
  houseId?: string;
  data: any;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

// ========== FEEDING RECORD SCHEMA ==========
export interface FeedingRecord {
  id: string;
  userId: string;
  date: string;
  houseId?: string;
  feedType: string;
  feedQuantity: number;
  feedUnit: string;
  costPerUnit: number;
  totalCost: number;
  supplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

// ========== HEALTH RECORD SCHEMA ==========
export interface HealthRecord {
  id: string;
  userId: string;
  date: string;
  houseId?: string;
  recordType: 'vaccination' | 'disease' | 'treatment' | 'checkup' | 'mortality';
  title: string;
  description: string;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  dosage?: string;
  veterinarian?: string;
  cost?: number;
  followUpDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

// ========== FINANCIAL RECORD SCHEMA ==========
export interface FinancialRecord {
  id: string;
  userId: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  paymentMethod?: 'cash' | 'mobile' | 'bank' | 'credit';
  reference?: string;
  supplier?: string;
  customer?: string;
  houseId?: string;
  tags: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
}

// ========== API RESPONSE TYPES ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// ========== AUTH TYPES ==========
export interface LoginCredentials {
  email?: string;
  phone?: string;
  username?: string;
  password: string;
}

export interface LoginWithPhoneCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  email?: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  farmName?: string;
  businessName?: string;
  location?: string;
  region?: string;
  district?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expiresIn: number;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerify {
  phone: string;
  code: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  pid?: string;
}

// ========== DASHBOARD TYPES ==========
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingRequests: number;
  completedRequests: number;
}

export interface UserStats {
  totalFarmers: number;
  totalExtensionOfficers: number;
  totalLogisticsProviders: number;
  totalAgrovetOwners: number;
  totalMachineryDealers: number;
  totalBuyerAggregators: number;
}

// ========== LOCATION TYPES ==========
export interface Region {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  regionId: string;
}

export interface Ward {
  id: string;
  name: string;
  districtId: string;
}

// ========== FEEDING TYPES ==========
export interface FeedingSchedule {
  id: string;
  houseId: string;
  feedType: string;
  quantity: number;
  unit: string;
  time: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedingStats {
  totalFeedConsumed: number;
  totalCost: number;
  averageDailyConsumption: number;
  efficiency: number;
}

// ========== HEALTH TYPES ==========
export interface VaccinationRecord {
  id: string;
  userId: string;
  houseId?: string;
  vaccineName: string;
  administeredDate: string;
  nextDueDate: string;
  veterinarian?: string;
  cost?: number;
  status: 'scheduled' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface HealthStats {
  totalHealthRecords: number;
  vaccinationsCompleted: number;
  diseaseOutbreaks: number;
  mortalityRate: number;
}

// ========== PRODUCTION TYPES ==========
export interface ProductionStats {
  totalEggsProduced: number;
  totalChicksHatched: number;
  totalMortality: number;
  averageWeightGain: number;
  productionEfficiency: number;
}

// ========== FINANCIAL TYPES ==========
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  topExpenseCategory: string;
  topIncomeSource: string;
}

export interface LoanRequest {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  decisionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== SERVICE TYPES ==========
export interface ServiceStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  averageResponseTime: number;
}

// ========== NOTIFICATION TYPES ==========
export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  systemNotifications: number;
  userNotifications: number;
}

// ========== PAGINATION TYPES ==========
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ========== FILTER TYPES ==========
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface LocationFilter {
  region?: string;
  district?: string;
}

export interface StatusFilter {
  status?: string;
}

// ========== ERROR TYPES ==========
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// ========== FORM TYPES ==========
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: FormFieldError[];
  touched: Record<string, boolean>;
}

// ========== FARMER SPECIFIC TYPES ==========
export const FarmerCategory = {
  INDIVIDUAL: 'INDIVIDUAL',
  GROUP: 'GROUP',
  COMPANY: 'COMPANY',
  ORGANIZATION: 'ORGANIZATION'
} as const;

export type FarmerCategory = typeof FarmerCategory[keyof typeof FarmerCategory];

export const FarmerType = {
  CROP: 'CROP',
  LIVESTOCK: 'LIVESTOCK',
  MIXED: 'MIXED',
  FISH: 'FISH',
  MUSHROOM: 'MUSHROOM'
} as const;

export type FarmerType = typeof FarmerType[keyof typeof FarmerType];

export const CropType = {
  MAIZE: 'MAIZE',
  BEANS: 'BEANS',
  VEGETABLES: 'VEGETABLES',
  FRUITS: 'FRUITS',
  RICE: 'RICE',
  WHEAT: 'WHEAT',
  SORGHUM: 'SORGHUM',
  MILLET: 'MILLET',
  CASSAVA: 'CASSAVA',
  POTATOES: 'POTATOES',
  TOMATOES: 'TOMATOES',
  ONIONS: 'ONIONS',
  OTHER: 'OTHER'
} as const;

export type CropType = typeof CropType[keyof typeof CropType];

export const LivestockType = {
  CATTLE: 'CATTLE',
  POULTRY: 'POULTRY',
  GOAT: 'GOAT',
  SHEEP: 'SHEEP',
  PIGS: 'PIGS',
  RABBITS: 'RABBITS',
  FISH: 'FISH',
  BEE: 'BEE',
  OTHER: 'OTHER'
} as const;

export type LivestockType = typeof LivestockType[keyof typeof LivestockType];

export interface FarmerProfile {
  farmerCategory: FarmerCategory;
  farmerType: FarmerType;
  crops?: CropType[];
  livestock?: LivestockType[];
  farmName?: string;
  registrationNumber?: string;
  farmSize?: number; // in acres
  location: {
    region: string;
    district: string;
    village?: string;
    houseNo?: string;
  };
}

// ========== CASUAL LABOURER TYPES ==========
export const LabourType = {
  FARM_WORKER: 'FARM_WORKER',
  HARVESTER: 'HARVESTER',
  PLANTER: 'PLANTER',
  IRRIGATION_WORKER: 'IRRIGATION_WORKER',
  GENERAL_LABOUR: 'GENERAL_LABOUR',
  LIVESTOCK_HANDLER: 'LIVESTOCK_HANDLER'
} as const;

export type LabourType = typeof LabourType[keyof typeof LabourType];

export const SkillLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  EXPERT: 'EXPERT'
} as const;

export type SkillLevel = typeof SkillLevel[keyof typeof SkillLevel];

export interface CasualLabourerProfile {
  labourType: LabourType[];
  skillLevel: SkillLevel;
  experience: number; // years of experience
  availableDays: string[]; // days of week available
  hourlyRate?: number;
  physicalStrength: 'LOW' | 'MEDIUM' | 'HIGH';
  toolsOwned?: string[];
  preferredWorkLocation?: string[];
}

// ========== EXTENSION OFFICER TYPES ==========
export const ExtensionSpecialization = {
  CROP_MANAGEMENT: 'CROP_MANAGEMENT',
  LIVESTOCK_MANAGEMENT: 'LIVESTOCK_MANAGEMENT',
  SOIL_SCIENCE: 'SOIL_SCIENCE',
  PEST_MANAGEMENT: 'PEST_MANAGEMENT',
  IRRIGATION: 'IRRIGATION',
  AGRIBUSINESS: 'AGRIBUSINESS',
  SUSTAINABLE_AGRICULTURE: 'SUSTAINABLE_AGRICULTURE'
} as const;

export type ExtensionSpecialization = typeof ExtensionSpecialization[keyof typeof ExtensionSpecialization];

export interface ExtensionOfficerProfile {
  licenseNumber: string;
  specialization: ExtensionSpecialization[];
  qualifications: string[];
  yearsOfExperience: number;
  institution?: string;
  serviceAreas: string[]; // regions/districts served
  consultationFee?: number;
  languages: string[];
}

// ========== LOGISTICS PROVIDER TYPES ==========
export const TransportType = {
  TRUCK: 'TRUCK',
  PICKUP: 'PICKUP',
  MOTORCYCLE: 'MOTORCYCLE',
  TRACTOR_TRAILER: 'TRACTOR_TRAILER',
  REFRIGERATED_TRUCK: 'REFRIGERATED_TRUCK'
} as const;

export type TransportType = typeof TransportType[keyof typeof TransportType];

export interface LogisticsProviderProfile {
  transportTypes: TransportType[];
  vehicleCapacity: number; // in tons
  serviceAreas: string[];
  insurance: boolean;
  gpsTracking: boolean;
  perKmRate?: number;
  perHourRate?: number;
  driverExperience: number;
  specialHandling: boolean; // for fragile/perishable goods
}

// ========== AGROVET OWNER TYPES ==========
export const AgrovetCategory = {
  INPUTS_SUPPLIER: 'INPUTS_SUPPLIER',
  VETERINARY_SERVICES: 'VETERINARY_SERVICES',
  SEEDS_SUPPLIER: 'SEEDS_SUPPLIER',
  FERTILIZER_SUPPLIER: 'FERTILIZER_SUPPLIER',
  EQUIPMENT_SUPPLIER: 'EQUIPMENT_SUPPLIER',
  FULL_SERVICE: 'FULL_SERVICE'
} as const;

export type AgrovetCategory = typeof AgrovetCategory[keyof typeof AgrovetCategory];

export interface AgrovetOwnerProfile {
  businessLicense: string;
  agrovetCategory: AgrovetCategory[];
  physicalStore: boolean;
  onlineStore: boolean;
  deliveryService: boolean;
  productCategories: string[];
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  veterinaryServices?: boolean;
  staffCount: number;
}

// ========== MACHINERY DEALER TYPES ==========
export const MachineryType = {
  TRACTOR: 'TRACTOR',
  PLOUGH: 'PLOUGH',
  HARVESTER: 'HARVESTER',
  IRRIGATION_PUMP: 'IRRIGATION_PUMP',
  THRESHER: 'THRESHER',
  MILLING_MACHINE: 'MILLING_MACHINE',
  PLANTER: 'PLANTER',
  SPRAYER: 'SPRAYER'
} as const;

export type MachineryType = typeof MachineryType[keyof typeof MachineryType];

export interface MachineryDealerProfile {
  businessLicense: string;
  machineryTypes: MachineryType[];
  services: ('SALE' | 'RENTAL' | 'SERVICE' | 'TRAINING')[];
  newAndUsed: ('NEW' | 'USED' | 'BOTH')[];
  technicalSupport: boolean;
  deliveryService: boolean;
  financingAvailable: boolean;
  serviceAreas: string[];
}

// ========== BUYER AGGREGATOR TYPES ==========
export const BuyerType = {
  INDIVIDUAL: 'INDIVIDUAL',
  COOPERATIVE: 'COOPERATIVE',
  PROCESSOR: 'PROCESSOR',
  EXPORTER: 'EXPORTER',
  WHOLESALER: 'WHOLESALER',
  RETAILER: 'RETAILER',
  INSTITUTION: 'INSTITUTION'
} as const;

export type BuyerType = typeof BuyerType[keyof typeof BuyerType];

export const ProductCategory = {
  GRAINS: 'GRAINS',
  VEGETABLES: 'VEGETABLES',
  FRUITS: 'FRUITS',
  LIVESTOCK: 'LIVESTOCK',
  DAIRY: 'DAIRY',
  POULTRY: 'POULTRY',
  PROCESSED: 'PROCESSED'
} as const;

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];

export interface BuyerAggregatorProfile {
  buyerType: BuyerType;
  businessLicense?: string;
  productCategories: ProductCategory[];
  purchaseCapacity: number; // in tons per month
  targetRegions: string[];
  qualityStandards: string[];
  paymentTerms: string;
  storageCapacity?: number;
  processingFacilities: boolean;
}

// ========== UPLOAD TYPES ==========
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface UploadResponse {
  success: boolean;
  file?: FileUpload;
  error?: string;
}

// ========== EXTENSION OFFICER TYPES ==========
export const ExpertiseArea = {
  CROP_MANAGEMENT: 'CROP_MANAGEMENT',
  LIVESTOCK_MANAGEMENT: 'LIVESTOCK_MANAGEMENT',
  PEST_DISEASE_CONTROL: 'PEST_DISEASE_CONTROL',
  SOIL_HEALTH: 'SOIL_HEALTH',
  IRRIGATION_MANAGEMENT: 'IRRIGATION_MANAGEMENT',
  POST_HARVEST_HANDLING: 'POST_HARVEST_HANDLING',
  ORGANIC_FARMING: 'ORGANIC_FARMING',
  CLIMATE_SMART_AGRICULTURE: 'CLIMATE_SMART_AGRICULTURE',
  AGRIBUSINESS: 'AGRIBUSINESS',
  MARKET_LINKAGES: 'MARKET_LINKAGES'
} as const;

export type ExpertiseArea = typeof ExpertiseArea[keyof typeof ExpertiseArea];

export const ServiceType = {
  EXTENSION: 'EXTENSION',
  CONSULTATION: 'CONSULTATION',
  TRAINING: 'TRAINING',
  FIELD_VISIT: 'FIELD_VISIT',
  WORKSHOP: 'WORKSHOP',
  DEMONSTRATION: 'DEMONSTRATION'
} as const;

export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

// ========== CASUAL LABOURER TYPES ==========
export const SkillCategory = {
  FARMING: 'FARMING',
  HARVESTING: 'HARVESTING',
  PLANTING: 'PLANTING',
  IRRIGATION: 'IRRIGATION',
  PEST_CONTROL: 'PEST_CONTROL',
  FERTILIZER_APPLICATION: 'FERTILIZER_APPLICATION',
  WEEDING: 'WEEDING',
  PRUNING: 'PRUNING',
  PACKAGING: 'PACKAGING',
  TRANSPORTATION: 'TRANSPORTATION',
  GENERAL_LABOR: 'GENERAL_LABOR'
} as const;

export type SkillCategory = typeof SkillCategory[keyof typeof SkillCategory];

export const WorkType = {
  DAILY_WAGE: 'DAILY_WAGE',
  CONTRACT_BASIS: 'CONTRACT_BASIS',
  SEASONAL: 'SEASONAL',
  PART_TIME: 'PART_TIME',
  FULL_TIME: 'FULL_TIME',
  PROJECT_BASED: 'PROJECT_BASED'
} as const;

export type WorkType = typeof WorkType[keyof typeof WorkType];
