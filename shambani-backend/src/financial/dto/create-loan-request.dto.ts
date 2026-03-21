import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLoanRequestDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  amount: number;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}
