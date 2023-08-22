import { Module } from '@nestjs/common';
import { UserService } from '@octoco/shared';
import { UserController } from '../controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
