import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  farmName?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsEnum(['FARMER', 'CASUAL_LABOURER', 'EXTENSION_OFFICER', 'LOGISTICS_PROVIDER', 'AGROVET_OWNER', 'MACHINERY_DEALER', 'BUYER_AGGREGATOR', 'SUPER_ADMIN'])
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
