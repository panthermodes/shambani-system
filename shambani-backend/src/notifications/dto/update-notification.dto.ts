import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @IsEnum(['info', 'warning', 'success', 'error', 'reminder', 'alert'])
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder' | 'alert';

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  priority: 'low' | 'medium' | 'high' | 'critical';

  @IsString()
  @IsOptional()
  actionUrl?: string;

  @IsString()
  @IsOptional()
  actionText?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsOptional()
  sender?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateNotificationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(['info', 'warning', 'success', 'error', 'reminder', 'alert'])
  @IsOptional()
  type?: 'info' | 'warning' | 'success' | 'error' | 'reminder' | 'alert';

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @IsString()
  @IsOptional()
  actionUrl?: string;

  @IsString()
  @IsOptional()
  actionText?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsOptional()
  sender?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
