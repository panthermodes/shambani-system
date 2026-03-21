import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PoultryModule } from './poultry/poultry.module';
import { FeedingModule } from './feeding/feeding.module';
import { HealthModule } from './health/health.module';
import { ProductionModule } from './production/production.module';
import { FinancialModule } from './financial/financial.module';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   sortSchema: true,
    //   playground: true,
    //   introspection: true,
    //   context: ({ req }) => ({ req }),
    // }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PoultryModule,
    FeedingModule,
    HealthModule,
    ProductionModule,
    FinancialModule,
    ServicesModule,
    NotificationsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
