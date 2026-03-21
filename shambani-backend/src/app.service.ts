import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Shambani Backend API!';
  }

  getHealth(): object {
    return {
      status: 'ok',
      message: 'Shambani Backend API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
