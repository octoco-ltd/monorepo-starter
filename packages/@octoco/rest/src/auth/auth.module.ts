import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],
  controllers: [AuthController],
  exports: [FirebaseService],
})
export class AuthModule {}
