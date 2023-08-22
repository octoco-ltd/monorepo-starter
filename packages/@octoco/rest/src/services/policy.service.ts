import { MongoAbility, Subject, defineAbility } from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@octoco/shared';

// TODO: we should move the policy map into a config provider
export const POLICY_MAP = 'POLICY_MAP';

// A role authorises a user to take a certain set of actions.
export type Role = string;

// An action is something a user does that requires authorisation.
// NOTE: 'manage' means 'any action' in CASL, for admin roles only
export type Action = 'manage' | 'create' | 'read' | 'update' | 'destroy';

// An ability represents a set of actions someone is authorised to take.
export type Ability = MongoAbility<[Action, Subject]>;

// Policies and policy maps determine the ability for each of a user's roles.
export type Policy = (user: User) => Ability;
export type PolicyMap = Map<Role, Policy>;

// Injectable wrapper around a policy map for testing:
@Injectable()
export class PolicyProvider {
  constructor(@Inject(POLICY_MAP) public readonly policyMap: PolicyMap) {}
}

// For now we can hard-code our role policies here:
export const defaultPolicyMap: PolicyMap = new Map([
  [
    'admin',
    () =>
      defineAbility<Ability>((can) => {
        can('manage', 'all'); // allow anything
      }),
  ],

  [
    'user',
    () =>
      defineAbility<Ability>((can) => {
        can('read', 'all'); // allow reading anything
      }),
  ],
]);
