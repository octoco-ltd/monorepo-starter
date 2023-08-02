---
to: packages/@octoco/models/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.service.spec.ts
---
import { Test, TestingModule } from '@nestjs/testing';
import { <%=h.changeCase.pascalCase(name)%>Service } from './<%=h.changeCase.paramCase(name)%>.service';
import { DynamicModule } from '@nestjs/common';
import { DBModule, TeardownFn } from '../db.module';
import { MikroORM } from '@mikro-orm/core';

describe('<%=h.changeCase.pascalCase(name)%>Service', () => {
  // test state
  let s: <%=h.changeCase.pascalCase(name)%>Service;
  let orm: MikroORM;

  // db state
  let dbModule: DynamicModule;
  let teardown: TeardownFn;

  beforeAll(async () => {
    [dbModule, teardown] = await DBModule.connectForTesting();

    // inject the test db into our service
    const module: TestingModule = await Test.createTestingModule({
      providers: [<%=h.changeCase.pascalCase(name)%>Service],
      imports: [dbModule],
    }).compile();

    s = module.get<<%=h.changeCase.pascalCase(name)%>Service>(<%=h.changeCase.pascalCase(name)%>Service);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await teardown();
    await orm.close(true);
  });

  describe('create', () => {
    it('should be able to create a <%=h.changeCase.pascalCase(name)%>', async () => {
      const x = await s.create({ name: 'name' });
      expect(x._id).not.toBeNull();
      expect(x.id).not.toBeNull();
    });
  });

  describe('findById', () => {
    it('should return null if the <%=h.changeCase.pascalCase(name)%> does not exist', async () => {
      expect(await s.findById('does-not-exist')).toBeNull();
    });

    it('should return the <%=h.changeCase.pascalCase(name)%> if it exists', async () => {
      const x = await s.create({ name: 'name' });
      const x2 = await s.findById(x.id);
      expect(x2).not.toBeNull();
      expect(x2!.id).toEqual(x.id);
    });
  });

  describe('update', () => {
    it('should throw if the <%=h.changeCase.pascalCase(name)%> does not exist', async () => {
      expect(s.update('does-not-exist', {})).rejects.toThrow();
    });

    it('should update the <%=h.changeCase.pascalCase(name)%> if it exists', async () => {
      const x = await s.create({ name: 'name' });
      const x2 = await s.update(x.id, { name: 'new-name' });
      const x3 = await s.findById(x.id);
      expect(x2.name).toEqual('new-name');
      expect(x2).toEqual(x3);
      expect(x2).not.toEqual(x);
    });
  });

  describe('remove', () => {
    it('should throw if the <%=h.changeCase.pascalCase(name)%> does not exist', async () => {
      expect(s.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the <%=h.changeCase.pascalCase(name)%> if it exists', async () => {
      const x = await s.create({ name: 'name' });
      expect(await s.findById(x.id)).not.toBeNull();
      await s.remove(x.id);
      expect(await s.findById(x.id)).toBeNull();
    });
  });
});
