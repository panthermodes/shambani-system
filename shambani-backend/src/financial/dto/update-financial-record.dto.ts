import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialRecordDto } from './create-financial-record.dto';

export class UpdateFinancialRecordDto extends PartialType(CreateFinancialRecordDto) {}
