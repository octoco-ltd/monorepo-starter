import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';

// NOTE: the server must have a GOOGLE_APPLICATION_CREDENTIALS env variable
// pointing to the location of a service account key to use firebase admin.
// TODO: config service
@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  getAuth(): Auth {
    return admin.auth();
  }
}
