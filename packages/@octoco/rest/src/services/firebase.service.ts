import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@octoco/shared';
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Config, extractConfig } from '../config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly config: Config;
  public mock?: MockFirebaseService;

  constructor(private readonly configService: ConfigService) {
    this.config = extractConfig(configService);
    if (this.config.useMockFirebase) {
      this.mock = new MockFirebaseService();
    }
  }

  onModuleInit() {
    if (!this.config.useMockFirebase) {
      admin.initializeApp({
        credential: cert({
          projectId: this.config.firebaseProjectId,
          clientEmail: this.config.firebaseClientEmail,
          privateKey: this.config.firebasePrivateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  verifyIdToken(jwtToken: string): Promise<DecodedIdToken> {
    if (this.config.useMockFirebase) {
      return this.mock.verifyIdToken(jwtToken);
    }

    return admin.auth().verifyIdToken(jwtToken);
  }
}

// for testing and local dev
class MockFirebaseService {
  private fakeTokenMap: Map<string, User>;

  constructor() {
    this.fakeTokenMap = new Map();
  }

  mapTokenToUser(jwtToken: string, user: User) {
    this.fakeTokenMap.set(jwtToken, user);
  }

  // NOTE: must be kept in sync with auth.middleware.ts
  async verifyIdToken(jwtToken: string): Promise<DecodedIdToken> {
    const user = this.fakeTokenMap.get(jwtToken);
    if (user === undefined) {
      throw new Error(
        'Map a fake JWT token to a user before using it on a dev server.',
      );
    }

    return {
      uid: user.id,
    } as DecodedIdToken;
  }
}
