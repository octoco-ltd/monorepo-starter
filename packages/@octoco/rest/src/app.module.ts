import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GridOperatorModule } from './crud/grid-operator/grid-operator.module.js';
import { DBModule } from '@octoco/models';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard.js';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { UserModule } from './crud/users/user.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [DBModule.connect(), AuthModule, GridOperatorModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
