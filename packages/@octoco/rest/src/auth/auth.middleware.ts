import { Injectable, NestMiddleware } from '@nestjs/common';
import { User, UserService } from '@octoco/models';
import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from './firebase.service';

// We need to patch the express typings to type custom properties, see:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts#L19
declare global {
  // eslint-disable-next-line
  namespace Express {
    interface Request {
      /**
       * The User record of the authenticated user.
       */
      user?: User;
    }
  }
}

// Intercepts JWT tokens from firebase and injects the corresponding user
// instance into the request for the auth guard. Has to be middleware as it
// needs to run before the auth guard checks role policies.
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Nothing to do unless we have a bearer token to authenticate:
    if (!req.headers.authorization) return next();
    const parts = req.headers.authorization.split(' ');
    if (parts[0] !== 'Bearer') return next();

    const token = parts[1];
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(token);
    } catch (err) {
      throw new Error(`Failed to decode bearer token: ${err}`);
    }

    // Injects user into request for RBAC guards:
    const user = await this.userService.findById(decodedToken.uid);
    if (!user) {
      // TODO: this is a case where the user exists on firebase but we don't
      // have a database entry for them. Probably the right thing to do here
      // is redirect them to a registration page.
      throw new Error('No user corresponding to the given bearer token found.');
    } else {
      req.user = user;
      return next();
    }
  }
}
