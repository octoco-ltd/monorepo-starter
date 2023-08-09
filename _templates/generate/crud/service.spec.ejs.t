---
to: packages/@octoco/models/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.service.spec.ts
---
import { Test, TestingModule } from '@nestjs/testing';
import { <%=h.changeCase.pascalCase(name)%>Service } from './<%=h.changeCase.paramCase(name)%>.service';
import { DBModule } from '../db.module';

describe('<%=h.changeCase.pascalCase(name)%>Service', () => {
  let <%=h.changeCase.camelCase(name)%>Service: <%=h.changeCase.pascalCase(name)%>Service;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      providers: [<%=h.changeCase.pascalCase(name)%>Service],
    }).compile();

    <%=h.changeCase.camelCase(name)%>Service = module.get(<%=h.changeCase.pascalCase(name)%>Service);
  }, 60000);

  afterAll(async () => {
    module && (await module.close());
  });

  describe('create', () => {
    it('should be able to create a <%=h.changeCase.pascalCase(name)%>', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({ name: 'name' });
      expect(<%=h.changeCase.camelCase(name)%>._id).not.toBeNull();
      expect(<%=h.changeCase.camelCase(name)%>.id).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all the <%=h.changeCase.pascalCase(name)%>s that have been created', async () => {
      const <%=h.changeCase.camelCase(name)%>1 = await <%=h.changeCase.camelCase(name)%>Service.create({ name: 'name' });
      const <%=h.changeCase.camelCase(name)%>2 = await <%=h.changeCase.camelCase(name)%>Service.create({ name: 'name' });
      const <%=h.changeCase.camelCase(name)%>s = await <%=h.changeCase.camelCase(name)%>Service.findAll();
      expect(<%=h.changeCase.camelCase(name)%>s.length).toBeGreaterThan(0);
      expect(<%=h.changeCase.camelCase(name)%>s).toContainEqual(<%=h.changeCase.camelCase(name)%>1);
      expect(<%=h.changeCase.camelCase(name)%>s).toContainEqual(<%=h.changeCase.camelCase(name)%>2);
    });
  });

  describe('findById', () => {
    it('should return null if the <%=h.changeCase.pascalCase(name)%> does not exist', async () => {
      expect(await <%=h.changeCase.camelCase(name)%>Service.findById('does-not-exist')).toBeNull();
    });

    it('should return the <%=h.changeCase.pascalCase(name)%> if it exists', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({ name: 'name' });
      const <%=h.changeCase.camelCase(name)%>2 = await <%=h.changeCase.camelCase(name)%>Service.findById(<%=h.changeCase.camelCase(name)%>.id);
      expect(<%=h.changeCase.camelCase(name)%>2).not.toBeNull();
      expect(<%=h.changeCase.camelCase(name)%>2!.id).toEqual(<%=h.changeCase.camelCase(name)%>.id);
    });
  });

  describe('update', () => {
    it('should throw if the <%=h.changeCase.pascalCase(name)%> does not exist', async () => {
      expect(<%=h.changeCase.camelCase(name)%>Service.update('does-not-exist', {})).rejects.toThrow();
    });

    it('should update the <%=h.changeCase.pascalCase(name)%> if it exists', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({ name: 'name' });
      const <%=h.changeCase.camelCase(name)%>2 = await <%=h.changeCase.camelCase(name)%>Service.update(<%=h.changeCase.camelCase(name)%>.id, {
        name: 'new-name',
      });
      const <%=h.changeCase.camelCase(name)%>3 = await <%=h.changeCase.camelCase(name)%>Service.findById(<%=h.changeCase.camelCase(name)%>.id);
      expect(<%=h.changeCase.camelCase(name)%>2.name).toEqual('new-name');
      expect(<%=h.changeCase.camelCase(name)%>2).toEqual(<%=h.changeCase.camelCase(name)%>3);
      expect(<%=h.changeCase.camelCase(name)%>2).not.toEqual(<%=h.changeCase.camelCase(name)%>);
    });
  });

  describe('remove', () => {
    it('should throw if the <%=h.changeCase.pascalCase(name)%> does not exist', async () => {
      expect(<%=h.changeCase.camelCase(name)%>Service.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the <%=h.changeCase.pascalCase(name)%> if it exists', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({ name: 'name' });
      expect(await <%=h.changeCase.camelCase(name)%>Service.findById(<%=h.changeCase.camelCase(name)%>.id)).not.toBeNull();
      await <%=h.changeCase.camelCase(name)%>Service.remove(<%=h.changeCase.camelCase(name)%>.id);
      expect(await <%=h.changeCase.camelCase(name)%>Service.findById(<%=h.changeCase.camelCase(name)%>.id)).toBeNull();
    });
  });
});
