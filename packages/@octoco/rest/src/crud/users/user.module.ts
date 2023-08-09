import { Module } from '@nestjs/common';
import { UserService } from '@octoco/models';
import { UserController } from './user.controller.js';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
