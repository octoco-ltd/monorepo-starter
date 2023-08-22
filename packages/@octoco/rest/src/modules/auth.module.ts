import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from '../services/firebase.service';
import {
  POLICY_MAP,
  PolicyProvider,
  defaultPolicyMap,
} from '../services/policy.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: POLICY_MAP,
      useValue: defaultPolicyMap,
    },
    PolicyProvider,
    FirebaseService,
  ],
  exports: [FirebaseService, PolicyProvider],
})
export class AuthModule {}
