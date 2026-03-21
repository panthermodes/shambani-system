import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLogisticsDto {
  @IsString()
  orderId: string;

  @IsEnum(['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED'])
  @IsOptional()
  deliveryStatus?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  estimatedDelivery?: Date;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
