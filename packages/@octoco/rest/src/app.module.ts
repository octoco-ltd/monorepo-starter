import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DBModule } from '@octoco/models';
import { AuthGuard } from './auth/auth.guard.js';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { AuthModule } from './auth/auth.module.js';
import { getConfig } from './config/config.js';
import { TradeGroupModule } from './crud/trade-group/trade-group.module.js';
import { UserModule } from './crud/users/user.module.js';

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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
