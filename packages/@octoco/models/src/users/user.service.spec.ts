import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../db.module';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

const adminUserDto: CreateUserDto = {
  email: 'admin@octoco.ltd',
  roles: ['admin'],
};

describe('UserService', () => {
  let userService: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      providers: [UserService],
    }).compile();

    userService = module.get(UserService);
  }, 60000);

  afterAll(async () => {
    module && (await module.close());
  });

  describe('create', () => {
    it('should be able to create a valid User', async () => {
      const x = await userService.create(adminUserDto);
      expect(x._id).not.toBeNull();
      expect(x.id).not.toBeNull();
      expect(x.email).toEqual(adminUserDto.email);
      expect(x.roles).toEqual(adminUserDto.roles);
    });
  });

  describe('findById', () => {
    it('should return null if the User does not exist', async () => {
      expect(await userService.findById('does-not-exist')).toBeNull();
    });

    it('should return the User if it exists', async () => {
      const x = await userService.create(adminUserDto);
      const x2 = await userService.findById(x.id);
      expect(x2).not.toBeNull();
      expect(x2).toEqual(x);
    });
  });

  describe('addRoles', () => {
    it('should add new roles', async () => {
      const x = await userService.create(adminUserDto);
      await userService.addRoles(x.id, ['new-role', 'new-role2']);
      const x2 = await userService.findById(x.id);
      expect(x2!.roles).toEqual(['admin', 'new-role', 'new-role2']);
    });

    it('should merge duplicate roles', async () => {
      const x = await userService.create(adminUserDto);
      await userService.addRoles(x.id, ['admin', 'new-role']);
      const x2 = await userService.findById(x.id);
      expect(x2!.roles).toEqual(['admin', 'new-role']);
    });
  });

  describe('removeRoles', () => {
    it('should remove roles', async () => {
      const x = await userService.create(adminUserDto);
      await userService.removeRoles(x.id, ['new-role', 'admin']);
      const x2 = await userService.findById(x.id);
      expect(x2!.roles).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should throw if the User does not exist', async () => {
      expect(userService.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the User if it exists', async () => {
      const x = await userService.create(adminUserDto);
      expect(await userService.findById(x.id)).not.toBeNull();
      await userService.remove(x.id);
      expect(await userService.findById(x.id)).toBeNull();
    });
  });
});
