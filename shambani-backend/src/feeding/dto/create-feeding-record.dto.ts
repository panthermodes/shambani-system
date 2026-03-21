import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeedingRecordDto {
  @IsString()
  @IsOptional()
  houseId?: string;

  @IsString()
  feedType: string;

  @IsNumber()
  feedQuantity: number;

  @IsString()
  feedUnit: string;

  @IsNumber()
  costPerUnit: number;

  @IsNumber()
  totalCost: number;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}
