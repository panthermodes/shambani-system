import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinancialRecordDto {
  @IsEnum(['revenue', 'expense'])
  type: 'revenue' | 'expense';

  @IsEnum(['feed_cost', 'medicine', 'sales', 'equipment', 'labor', 'veterinary', 'transport', 'other'])
  category: string;

  @IsNumber()
  amount: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
