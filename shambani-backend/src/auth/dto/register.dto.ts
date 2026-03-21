import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, Matches, IsEnum, IsNumber, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  FARMER = 'FARMER',
  CASUAL_LABOURER = 'CASUAL_LABOURER',
  EXTENSION_OFFICER = 'EXTENSION_OFFICER',
  LOGISTICS_PROVIDER = 'LOGISTICS_PROVIDER',
  AGROVET_OWNER = 'AGROVET_OWNER',
  MACHINERY_DEALER = 'MACHINERY_DEALER',
  BUYER_AGGREGATOR = 'BUYER_AGGREGATOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum FarmerCategory {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
  COMPANY = 'COMPANY',
  ORGANIZATION = 'ORGANIZATION',
}

export enum FarmerType {
  CROP = 'CROP',
  LIVESTOCK = 'LIVESTOCK',
  MIXED = 'MIXED',
}

export enum CropType {
  MAIZE = 'MAIZE',
  BEANS = 'BEANS',
  VEGETABLES = 'VEGETABLES',
  FRUITS = 'FRUITS',
  RICE = 'RICE',
  WHEAT = 'WHEAT',
  SORGHUM = 'SORGHUM',
  MILLET = 'MILLET',
  CASSAVA = 'CASSAVA',
  POTATOES = 'POTATOES',
  TOMATOES = 'TOMATOES',
  ONIONS = 'ONIONS',
  SUGARCANE = 'SUGARCANE',
  COFFEE = 'COFFEE',
  TEA = 'TEA',
  COTTON = 'COTTON',
  TOBACCO = 'TOBACCO',
  OTHER = 'OTHER',
}

export enum LivestockType {
  CATTLE = 'CATTLE',
  POULTRY = 'POULTRY',
  GOAT = 'GOAT',
  SHEEP = 'SHEEP',
  PIGS = 'PIGS',
  RABBITS = 'RABBITS',
  FISH = 'FISH',
  BEE = 'BEE',
  OTHER = 'OTHER',
}

// Extended registration DTO for farmers with complete profile data
export class RegisterDto {
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Phone must be at least 10 characters' })
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  })
  password: string;

  // Farmer-specific profile data
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  farmName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({
    enum: FarmerType,
    enumName: 'FarmerType',
  })
  @IsOptional()
  @IsEnum(FarmerType)
  farmerType?: FarmerType;

  @ApiPropertyOptional({
    enum: FarmerCategory,
    enumName: 'FarmerCategory',
  })
  @IsOptional()
  @IsEnum(FarmerCategory)
  farmerCategory?: FarmerCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  farmSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  farmSizeUnit?: string;

  @ApiPropertyOptional({
    enum: CropType,
    enumName: 'CropType',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CropType, { each: true })
  crops?: CropType[];

  @ApiPropertyOptional({
    enum: LivestockType,
    enumName: 'LivestockType',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(LivestockType, { each: true })
  livestock?: LivestockType[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  farmingMethods?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  village?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gpsCoordinates?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alternativePhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;
}

// Backend registration DTO (for admin use)
export class FullRegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  })
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastName!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Phone must be at least 10 characters' })
  phone?: string;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  farmName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;
}