import {
  MongoAbility,
  Subject,
  createMongoAbility,
  defineAbility,
} from '@casl/ability';
import { User } from '@octoco/models';

// A role authorises a user to take a certain set of actions.
export enum Role {
  Admin = 'admin',
  General = 'general',
}

// Converts a string to a role, or throws if it doesn't exist.
export function parseRole(roleStr: string): Role {
  const index = Object.keys(Role).indexOf(roleStr.toLowerCase());
  if (index === -1) {
    throw new Error(`No role "${roleStr}" has been defined.`);
  } else {
    return Role[index];
  }
}

// An action is something a user does that requires authorisation.
// NOTE: 'manage' means 'any action' in CASL, for admin roles only
export type Action = 'manage' | 'create' | 'read' | 'destroy';

// An ability determines the set of actions a user is authorised to take.
export type Ability = MongoAbility<[Action, Subject]>;

// You can define each policy here:
type Policy = (user: User) => Ability;
const policyMap: Map<Role, Policy> = new Map([
  [
    Role.Admin,
    (user) =>
      defineAbility<Ability>((can, cannot) => {
        can('manage', 'all'); // allow anything
      }),
  ],

  [
    Role.General,
    (user) =>
      defineAbility<Ability>((can, cannot) => {
        can('read', 'all'); // allow reading anything
      }),
  ],
]);

// Constructs a CASL ability for the given user according to their roles.
export function createAbilityForUser(user: User): Ability {
  const abilities: Ability[] = [];
  for (const roleStr of user.roles) {
    const role = parseRole(roleStr);
    if (!policyMap.has(role)) {
      throw new Error(`No policy definition was found for role "${roleStr}".`);
    }

    // Construct the ability for this role:
    abilities.push(policyMap.get(role)(user));
  }

  // Merge the role abilities to get the user's complete set of permissions:
  return abilities.reduce(
    (totalAbility, currentAbility) =>
      createMongoAbility(totalAbility.rules.concat(currentAbility.rules)),
    createMongoAbility<Ability>(),
  );
}
