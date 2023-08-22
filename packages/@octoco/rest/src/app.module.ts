import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DBModule } from '@octoco/shared';
import { getConfig } from './config';
import { SentryFilter } from './filters/sentry.filter';
import { AuthGuard } from './guards/auth.guard';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SentryMiddleware } from './middleware/sentry.middleware';
import { AuthModule } from './modules/auth.module';
import { SentryModule } from './modules/sentry.module';
import { TradeGroupModule } from './modules/trade-group.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
    }),
    DBModule.forRoot({
      // TODO: how to use config service here?
      databaseUrl: process.env.DATABASE_URL,
      useInMemoryDb: !!JSON.parse(process.env.USE_IN_MEMORY_DB || 'false'),
    }),
    SentryModule,
    AuthModule,
    UserModule,
    TradeGroupModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SentryFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(SentryMiddleware).forRoutes('*');
  }
}
