import { Subject } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { Ability, Action } from './types.js';

// Nest metadata key used for guarding routes.
export const AUTH_HANDLERS_KEY = 'auth_handlers';

// An auth handler takes a user's CASL abilities and checks whether they are
// authorise to use a given route. Truthy is authorised, falsy is not.
export type AuthHandler = (ability: Ability) => boolean;

// Restricts access to a route. Users must be logged in and have an appropriate
// role assigned to them in order to access guarded routes.
export const AuthFn = (...handlers: AuthHandler[]) =>
  SetMetadata(AUTH_HANDLERS_KEY, handlers);

// Restricts access to a route. Users must be logged in and have an appropriate
// role assigned to them in order to access guarded routes.
export const Auth = (action: Action, subject: Subject) =>
  AuthFn((ability) => ability.can(action, subject));
