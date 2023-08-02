import { Test, TestingModule } from '@nestjs/testing';
import { GridOperatorController } from './grid-operator.controller';
import {
  DBModule,
  TeardownFn,
  GridOperatorService,
} from '@octoco/models';
import { DynamicModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

describe('GridOperatorController', () => {
  // test state
  let c: GridOperatorController;
  let orm: MikroORM;

  // db state
  let dbModule: DynamicModule;
  let teardown: TeardownFn;

  beforeEach(async () => {
    [dbModule, teardown] = await DBModule.connectForTesting();

    // inject the test db into our controller
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GridOperatorController],
      providers: [GridOperatorService],
      imports: [dbModule],
    }).compile();

    c = module.get<GridOperatorController>(GridOperatorController);
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
