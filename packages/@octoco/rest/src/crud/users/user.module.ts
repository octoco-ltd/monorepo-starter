import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from '@octoco/models';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
