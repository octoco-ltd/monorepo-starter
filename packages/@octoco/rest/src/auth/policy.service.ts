import { defineAbility } from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';
import { Ability, PolicyMap } from './types.js';

// TODO: we should move the policy map into a config provider
export const POLICY_MAP = 'POLICY_MAP';

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
