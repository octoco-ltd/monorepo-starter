import { MongoAbility, Subject, createMongoAbility } from '@casl/ability';
import { User } from '@octoco/models';

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

// Constructs a CASL ability for the given user according to their roles.
export function createAbilityForUser(
  policyMap: PolicyMap,
  user: User,
): Ability {
  const abilities: Ability[] = [];
  for (const role of user.roles) {
    if (!policyMap.has(role)) {
      throw new Error(`No policy definition was found for role "${role}".`);
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
