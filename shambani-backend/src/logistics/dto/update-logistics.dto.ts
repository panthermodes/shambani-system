import { PartialType } from '@nestjs/mapped-types';
import { CreateLogisticsDto } from './create-logistics.dto';

export class UpdateLogisticsDto extends PartialType(CreateLogisticsDto) {}
