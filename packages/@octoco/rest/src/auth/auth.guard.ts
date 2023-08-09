import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@octoco/models';
import { AUTH_HANDLERS_KEY, AuthHandler } from './auth.decorator.js';
import { PolicyProvider } from './policy.service.js';
import { createAbilityForUser } from './types.js';

/**
 * An implementation of a CASL-based authorisation guard. The idea is that we
 * decorate each controller or route with an appropriate @Policy(...) decorator
 * that specifies which CASL abilities a user must have to make use of that
 * route.
 *
 * Users can be configured with a set of _roles_, each of which is granted
 * certain abilities - see './roles.ts'. If the user has a role with the
 * correct abilities for a given route, they are granted access (return true).
 * Otherwise we deny them access (return false).
 *
 * See: https://docs.nestjs.com/guards
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private refl: Reflector,
    private policyProvider: PolicyProvider,
  ) {}

  canActivate(ctx: ExecutionContext) {
    const handlers: AuthHandler[] = this.refl.getAllAndMerge(
      AUTH_HANDLERS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    // Routes with no auth handlers can be accessed by anyone:
    if (handlers === null || handlers.length === 0) {
      return true;
    }

    // If there's no user to authenticate we fail with a 401:
    const { user }: { user: User } = ctx.switchToHttp().getRequest();
    if (user == null) {
      throw new UnauthorizedException();
    }

    // The user must have an appropriate role for this route:
    const ability = createAbilityForUser(this.policyProvider.policyMap, user);
    for (const handler of handlers) {
      if (!handler(ability)) return false;
    }

    return true;
  }
}
