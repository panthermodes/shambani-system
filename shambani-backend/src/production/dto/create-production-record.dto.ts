import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductionRecordDto {
  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  houseId?: string;

  @IsString()
  recordType: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  data?: string; // JSON string for additional data

  @IsString()
  @IsOptional()
  notes?: string;
}
