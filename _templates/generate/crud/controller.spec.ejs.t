---
to: packages/@octoco/rest/src/crud/<%=h.changeCase.paramCase(name)%>/<%=h.changeCase.paramCase(name)%>.controller.spec.ts
---
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { <%=h.changeCase.pascalCase(name)%>Controller } from './<%=h.changeCase.paramCase(name)%>.controller';
import { DBModule, <%=h.changeCase.pascalCase(name)%>Service } from '@octoco/models';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

describe('<%=h.changeCase.pascalCase(name)%>Controller', () => {
  let app: INestApplication;
  let <%=h.changeCase.camelCase(name)%>Service: <%=h.changeCase.pascalCase(name)%>Service;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      controllers: [<%=h.changeCase.pascalCase(name)%>Controller],
      providers: [<%=h.changeCase.pascalCase(name)%>Service],
    }).compile();

    <%=h.changeCase.camelCase(name)%>Service = module.get(<%=h.changeCase.pascalCase(name)%>Service);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // enable validation
    await app.init();
  }, 60000);

  afterAll(async () => {
    app && (await app.close());
  });

  describe('POST /<%=h.changeCase.paramCase(name)%>', () => {
    it('should 400 on invalid input', async () => {
      return request(app.getHttpServer())
        .post('/<%=h.changeCase.paramCase(name)%>')
        .send({
          invalid: 'field',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should 201 an return created <%=h.changeCase.paramCase(name)%> on valid input', async () => {
      const res = await request(app.getHttpServer())
        .post('/<%=h.changeCase.paramCase(name)%>')
        .send({ name: 'test-<%=h.changeCase.paramCase(name)%>' })
        .expect(HttpStatus.CREATED);

      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.findById(res.body.id);
      expect(<%=h.changeCase.camelCase(name)%>.name).toEqual(res.body.name);
    });
  });

  describe('GET /<%=h.changeCase.paramCase(name)%>', () => {
    it('should 200 with all <%=h.changeCase.paramCase(name)%>s', async () => {
      const <%=h.changeCase.camelCase(name)%>1 = await <%=h.changeCase.camelCase(name)%>Service.create({
        name: '<%=h.changeCase.paramCase(name)%>-1',
      });
      const <%=h.changeCase.camelCase(name)%>2 = await <%=h.changeCase.camelCase(name)%>Service.create({
        name: '<%=h.changeCase.paramCase(name)%>-2',
      });

      const res = await request(app.getHttpServer())
        .get('/<%=h.changeCase.paramCase(name)%>')
        .expect(HttpStatus.OK);
      expect(res.body).toContainEqual(JSON.parse(JSON.stringify(<%=h.changeCase.camelCase(name)%>1)));
      expect(res.body).toContainEqual(JSON.parse(JSON.stringify(<%=h.changeCase.camelCase(name)%>2)));
    });
  });

  describe('GET /<%=h.changeCase.paramCase(name)%>/:id', () => {
    it('should 404 if no <%=h.changeCase.paramCase(name)%> found', async () => {
      return request(app.getHttpServer())
        .get('/<%=h.changeCase.paramCase(name)%>/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and return <%=h.changeCase.paramCase(name)%> if found', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({
        name: '<%=h.changeCase.paramCase(name)%>',
      });

      const res = await request(app.getHttpServer())
        .get(`/<%=h.changeCase.paramCase(name)%>/${<%=h.changeCase.camelCase(name)%>.id}`)
        .expect(HttpStatus.OK);
      expect(res.body.name).toEqual(<%=h.changeCase.camelCase(name)%>.name);
    });
  });

  describe('PATCH /<%=h.changeCase.paramCase(name)%>/:id', () => {
    it('should 404 if no <%=h.changeCase.paramCase(name)%> found', async () => {
      return request(app.getHttpServer())
        .patch('/<%=h.changeCase.paramCase(name)%>/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and return updated <%=h.changeCase.paramCase(name)%> if found', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({
        name: '<%=h.changeCase.paramCase(name)%>',
      });

      const res = await request(app.getHttpServer())
        .patch(`/<%=h.changeCase.paramCase(name)%>/${<%=h.changeCase.camelCase(name)%>.id}`)
        .send({ name: 'modified-<%=h.changeCase.paramCase(name)%>' })
        .expect(HttpStatus.OK);

      const <%=h.changeCase.camelCase(name)%>2 = await <%=h.changeCase.camelCase(name)%>Service.findById(<%=h.changeCase.camelCase(name)%>.id);
      expect(<%=h.changeCase.camelCase(name)%>2.name).toEqual('modified-<%=h.changeCase.paramCase(name)%>');
      expect(res.body).toEqual(JSON.parse(JSON.stringify(<%=h.changeCase.camelCase(name)%>2)));
    });
  });

  describe('DELETE /<%=h.changeCase.paramCase(name)%>/:id', () => {
    it('should 404 if no <%=h.changeCase.paramCase(name)%> found', async () => {
      return request(app.getHttpServer())
        .delete('/<%=h.changeCase.paramCase(name)%>/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and delete <%=h.changeCase.paramCase(name)%> if found', async () => {
      const <%=h.changeCase.camelCase(name)%> = await <%=h.changeCase.camelCase(name)%>Service.create({
        name: '<%=h.changeCase.paramCase(name)%>',
      });

      await request(app.getHttpServer())
        .delete(`/<%=h.changeCase.paramCase(name)%>/${<%=h.changeCase.camelCase(name)%>.id}`)
        .expect(HttpStatus.OK);

      expect(await <%=h.changeCase.camelCase(name)%>Service.findById(<%=h.changeCase.camelCase(name)%>.id)).toBeNull();
    });
  });
});
