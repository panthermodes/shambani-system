import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionRecordDto } from './create-production-record.dto';

export class UpdateProductionRecordDto extends PartialType(CreateProductionRecordDto) {}
