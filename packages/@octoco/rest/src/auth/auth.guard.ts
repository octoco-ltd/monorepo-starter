import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_HANDLERS_KEY, AuthHandler } from './auth.decorator';
import { User } from '@octoco/models';
import { createAbilityForUser } from './roles';

/**
 * An implementation of a CASL-based authorisation guard. The idea is that we
 * decorate each controller or route with an appropriate @Policy(...) decorator
 * that specifies which CASL abilities a user must have to make use of that
 * route.
 *
 * Users can be configured with a set of _roles_, each of which is granted
 * certain CASL abilities - see './roles.ts'. If the user has a role with the
 * correct abilities for a given route, they are granted access (return true).
 * Otherwise we deny them access by throwing an unauthorised exception.
 *
 * See: https://docs.nestjs.com/guards
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private refl: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const handlers: AuthHandler[] = this.refl.getAllAndMerge(
      AUTH_HANDLERS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    // Routes with no auth handlers can be accessed by anyone:
    if (handlers === null || handlers.length === 0) {
      return true;
    }

    // Otherwise the user needs to have an appropriate role to access them:
    // TODO: inject user in auth middleware
    const { user } = ctx.switchToHttp().getRequest<{ user: User }>();
    const ability = createAbilityForUser(user);
    for (const handler of handlers) {
      if (!handler(ability)) return false;
    }

    return true;
  }
}
