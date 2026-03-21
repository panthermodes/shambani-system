import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
  ValidationPipeOptions,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(CustomValidationPipe.name);
  private readonly options: ValidationPipeOptions;

  constructor(options?: ValidationPipeOptions) {
    this.options = options || {};
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert plain object to class instance
    const object = plainToClass(metatype, value, this.options.transformOptions);
    
    // Validate the object
    const errors = await validate(object, {
      whitelist: this.options.whitelist,
      forbidNonWhitelisted: this.options.forbidNonWhitelisted,
    });

    if (errors.length > 0) {
      // Format validation errors
      const formattedErrors = this.formatErrors(errors);
      
      // Log validation errors for debugging
      this.logger.warn(`Validation failed: ${JSON.stringify(formattedErrors)}`);
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return this.options.transform ? object : value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): any {
    return errors.reduce((acc, error) => {
      const property = error.property;
      const constraints = error.constraints;
      
      if (constraints) {
        // Get the first constraint message for each property
        acc[property] = Object.values(constraints)[0];
      }
      
      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatErrors(error.children);
        acc[property] = { ...acc[property], ...nestedErrors };
      }
      
      return acc;
    }, {});
  }
}
