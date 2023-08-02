import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseService } from './firebase.service';
import { DecodedIdToken } from 'firebase-admin/auth';
import { User, UserService } from '@octoco/models';

declare global {
  namespace Express {
    interface Request {
      user?: User; // the logged-in user
    }
  }
}

// Intercepts JWT tokens from firebase and injects the corresponding user
// instance into the request for the auth guard. Has to be middleware as it
// needs to run before the auth guard checks role policies.
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private firebase: FirebaseService,
    private users: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // No header, nothing to authenticate.
    if (!req.headers.authorization) return next();

    // Check for a bearer token:
    const parts = req.headers.authorization.split(' ');
    if (parts[0] !== 'Bearer') return next();

    // Decode the bearer token:
    const token = parts[1];
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await this.firebase.getAuth().verifyIdToken(token);
    } catch (err) {
      throw new Error(`Failed to decode bearer token.`);
    }

    // Finally inject the corresponding user into the request:
    // TODO: use firebase user ID here or find by email?
    const user = await this.users.findById(decodedToken.uid);
    if (!user) {
      throw new Error('No user corresponding to the given bearer token found.');
    } else {
      req.user = user;
      return next();
    }
  }
}
