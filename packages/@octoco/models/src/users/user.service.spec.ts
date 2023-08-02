import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DynamicModule } from '@nestjs/common';
import { DBModule, TeardownFn } from '../db.module';
import { MikroORM } from '@mikro-orm/core';
import { CreateUserDto } from './user.dto';

const adminUserDto: CreateUserDto = {
  email: 'admin@switch.org.za',
  roles: ['admin'],
};

describe('UserService', () => {
  // test state
  let s: UserService;
  let orm: MikroORM;

  // db state
  let dbModule: DynamicModule;
  let teardown: TeardownFn;

  beforeAll(async () => {
    [dbModule, teardown] = await DBModule.connectForTesting();

    // inject the test db into our service
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [dbModule],
    }).compile();

    s = module.get<UserService>(UserService);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await teardown();
    await orm.close(true);
  });

  describe('create', () => {
    it('should be able to create a valid User', async () => {
      const x = await s.create(adminUserDto);
      expect(x._id).not.toBeNull();
      expect(x.id).not.toBeNull();
      expect(x.email).toEqual(adminUserDto.email);
      expect(x.roles).toEqual(adminUserDto.roles);
    });
  });

  describe('findById', () => {
    it('should return null if the User does not exist', async () => {
      expect(await s.findById('does-not-exist')).toBeNull();
    });

    it('should return the User if it exists', async () => {
      const x = await s.create(adminUserDto);
      const x2 = await s.findById(x.id);
      expect(x2).not.toBeNull();
      expect(x2).toEqual(x);
    });
  });

  describe('addRoles', () => {
    it('should add new roles', async () => {
      const x = await s.create(adminUserDto);
      await s.addRoles(x.id, ['new-role', 'new-role2']);
      const x2 = await s.findById(x.id);
      expect(x2!.roles).toEqual(['admin', 'new-role', 'new-role2']);
    });

    it('should merge duplicate roles', async () => {
      const x = await s.create(adminUserDto);
      await s.addRoles(x.id, ['admin', 'new-role']);
      const x2 = await s.findById(x.id);
      expect(x2!.roles).toEqual(['admin', 'new-role']);
    });
  });

  describe('removeRoles', () => {
    it('should remove roles', async () => {
      const x = await s.create(adminUserDto);
      await s.removeRoles(x.id, ['new-role', 'admin']);
      const x2 = await s.findById(x.id);
      expect(x2!.roles).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should throw if the User does not exist', async () => {
      expect(s.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the User if it exists', async () => {
      const x = await s.create(adminUserDto);
      expect(await s.findById(x.id)).not.toBeNull();
      await s.remove(x.id);
      expect(await s.findById(x.id)).toBeNull();
    });
  });
});
