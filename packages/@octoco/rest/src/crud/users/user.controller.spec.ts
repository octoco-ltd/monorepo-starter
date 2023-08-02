import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { DBModule, TeardownFn, UserService } from '@octoco/models';
import { DynamicModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

describe('UserController', () => {
  // test state
  let c: UserController;
  let orm: MikroORM;

  // db state
  let dbModule: DynamicModule;
  let teardown: TeardownFn;

  beforeEach(async () => {
    [dbModule, teardown] = await DBModule.connectForTesting();

    // inject the test db into our controller
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
      imports: [dbModule],
    }).compile();

    c = module.get<UserController>(UserController);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await teardown();
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(c).toBeDefined();
  });
});
