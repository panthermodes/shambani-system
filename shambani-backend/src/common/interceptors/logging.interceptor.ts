import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // Log incoming request
    const requestLog = {
      method,
      url,
      ip,
      userAgent,
      userId: (request as any).user?.userId,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`Incoming Request: ${JSON.stringify(requestLog)}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log successful response
          const duration = Date.now() - startTime;
          const responseLog = {
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            userId: (request as any).user?.userId,
            timestamp: new Date().toISOString(),
          };

          this.logger.log(`Response: ${JSON.stringify(responseLog)}`);
          
          // Log response data in development (be careful with sensitive data)
          if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
          }
        },
        error: (error) => {
          // Log error response
          const duration = Date.now() - startTime;
          const errorLog = {
            method,
            url,
            statusCode: error.status || 500,
            duration: `${duration}ms`,
            error: error.message,
            userId: (request as any).user?.userId,
            timestamp: new Date().toISOString(),
          };

          this.logger.error(`Error Response: ${JSON.stringify(errorLog)}`);
        },
      }),
    );
  }
}
