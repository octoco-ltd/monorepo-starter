import { TestEnv } from '..';
import { CreateUserDto } from '../dtos';

const adminUserDto: CreateUserDto = {
  email: 'admin@octoco.ltd',
  roles: ['admin'],
};

describe('UserService', () => {
  let env: TestEnv;

  beforeAll(async () => {
    env = await TestEnv.construct();
  }, 60000);

  afterAll(async () => {
    env && (await env.close());
  });

  describe('create', () => {
    it('should be able to create a valid User', async () => {
      const x = await env.userService.create(adminUserDto);
      expect(x._id).not.toBeNull();
      expect(x.id).not.toBeNull();
      expect(x.email).toEqual(adminUserDto.email);
      expect(x.roles).toEqual(adminUserDto.roles);
    });
  });

  describe('findById', () => {
    it('should return null if the User does not exist', async () => {
      expect(await env.userService.findById('does-not-exist')).toBeNull();
    });

    it('should return the User if it exists', async () => {
      const x = await env.userService.create(adminUserDto);
      const x2 = await env.userService.findById(x.id);
      expect(x2).not.toBeNull();
      expect(x2).toEqual(x);
    });
  });

  describe('addRoles', () => {
    it('should add new roles', async () => {
      const x = await env.userService.create(adminUserDto);
      await env.userService.addRoles(x.id, ['new-role', 'new-role2']);
      const x2 = await env.userService.findById(x.id);
      expect(x2!.roles).toEqual(['admin', 'new-role', 'new-role2']);
    });

    it('should merge duplicate roles', async () => {
      const x = await env.userService.create(adminUserDto);
      await env.userService.addRoles(x.id, ['admin', 'new-role']);
      const x2 = await env.userService.findById(x.id);
      expect(x2!.roles).toEqual(['admin', 'new-role']);
    });
  });

  describe('removeRoles', () => {
    it('should remove roles', async () => {
      const x = await env.userService.create(adminUserDto);
      await env.userService.removeRoles(x.id, ['new-role', 'admin']);
      const x2 = await env.userService.findById(x.id);
      expect(x2!.roles).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should throw if the User does not exist', async () => {
      expect(env.userService.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the User if it exists', async () => {
      const x = await env.userService.create(adminUserDto);
      expect(await env.userService.findById(x.id)).not.toBeNull();
      await env.userService.remove(x.id);
      expect(await env.userService.findById(x.id)).toBeNull();
    });
  });
});
