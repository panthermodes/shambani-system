import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthRecordDto } from './create-health-record.dto';

export class UpdateHealthRecordDto extends PartialType(CreateHealthRecordDto) {}
