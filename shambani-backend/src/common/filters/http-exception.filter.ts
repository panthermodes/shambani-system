import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details || (exceptionResponse as any).error;
      }
    } else {
      // Handle non-HTTP exceptions (database errors, etc.)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error occurred';
      
      // Log the full error for debugging
      this.logger.error(
        `Unhandled exception: ${exception}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    // Log the error with context
    const errorLog = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status,
      message,
      details,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      userId: (request as any).user?.userId,
    };

    this.logger.error(`HTTP Exception: ${JSON.stringify(errorLog)}`);

    // Send user-friendly error response
    const errorResponse = {
      success: false,
      error: {
        code: this.getErrorCode(status),
        message: this.getSanitizedMessage(message, status),
        details: this.getSanitizedDetails(details, status),
        timestamp: errorLog.timestamp,
        path: request.url,
      },
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      (errorResponse.error as any).stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: HttpStatus): string {
    const errorCodes = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };
    
    return errorCodes[status] || 'UNKNOWN_ERROR';
  }

  private getSanitizedMessage(message: string, status: HttpStatus): string {
    // Don't expose internal error details to users
    if (status >= 500) {
      return 'An unexpected error occurred. Please try again later.';
    }
    
    // Handle validation errors
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    
    return typeof message === 'string' ? message : 'Validation failed';
  }

  private getSanitizedDetails(details: any, status: HttpStatus): any {
    // Only include details for client errors (4xx)
    if (status >= 400 && status < 500) {
      return details;
    }
    
    // Don't expose internal details for server errors
    return undefined;
  }
}
