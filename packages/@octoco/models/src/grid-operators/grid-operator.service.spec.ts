import { Test, TestingModule } from '@nestjs/testing';
import { GridOperatorService } from './grid-operator.service';
import { DynamicModule } from '@nestjs/common';
import { DBModule, TeardownFn } from '../db.module';
import { MikroORM } from '@mikro-orm/core';

describe('GridOperatorService', () => {
  // test state
  let s: GridOperatorService;
  let orm: MikroORM;

  // db state
  let dbModule: DynamicModule;
  let teardown: TeardownFn;

  beforeAll(async () => {
    [dbModule, teardown] = await DBModule.connectForTesting();

    // inject the test db into our service
    const module: TestingModule = await Test.createTestingModule({
      providers: [GridOperatorService],
      imports: [dbModule],
    }).compile();

    s = module.get<GridOperatorService>(GridOperatorService);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await teardown();
    await orm.close(true);
  });

  describe('create', () => {
    it('should be able to create a GridOperator', async () => {
      const go = await s.create({ name: 'name' });
      expect(go._id).not.toBeNull();
      expect(go.id).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all the GridOperators that have been created', async () => {
      const go1 = await s.create({ name: 'name' });
      const go2 = await s.create({ name: 'name' });
      const gos = await s.findAll();
      expect(gos.length).toBeGreaterThan(0);
      expect(gos).toContainEqual(go1);
      expect(gos).toContainEqual(go2);
    });
  });

  describe('findById', () => {
    it('should return null if the GridOperator does not exist', async () => {
      expect(await s.findById('does-not-exist')).toBeNull();
    });

    it('should return the GridOperator if it exists', async () => {
      const go = await s.create({ name: 'name' });
      const go2 = await s.findById(go.id);
      expect(go2).not.toBeNull();
      expect(go2!.id).toEqual(go.id);
    });
  });

  describe('update', () => {
    it('should throw if the GridOperator does not exist', async () => {
      expect(s.update('does-not-exist', {})).rejects.toThrow();
    });

    it('should update the GridOperator if it exists', async () => {
      const go = await s.create({ name: 'name' });
      const go2 = await s.update(go.id, { name: 'new-name' });
      const go3 = await s.findById(go.id);
      expect(go2.name).toEqual('new-name');
      expect(go2).toEqual(go3);
      expect(go2).not.toEqual(go);
    });
  });

  describe('remove', () => {
    it('should throw if the GridOperator does not exist', async () => {
      expect(s.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the GridOperator if it exists', async () => {
      const go = await s.create({ name: 'name' });
      expect(await s.findById(go.id)).not.toBeNull();
      await s.remove(go.id);
      expect(await s.findById(go.id)).toBeNull();
    });
  });
});
