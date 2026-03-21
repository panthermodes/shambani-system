import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceRequestDto {
  @IsString()
  @IsOptional()
  farmId?: string;

  @IsEnum(['veterinary', 'consultation', 'feeding_program', 'vaccination', 'training', 'equipment', 'loan'])
  serviceType: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  urgency?: 'low' | 'medium' | 'high' | 'critical';

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledDate?: Date;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;
}

export class UpdateServiceRequestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  urgency?: 'low' | 'medium' | 'high' | 'critical';

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledDate?: Date;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsEnum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
