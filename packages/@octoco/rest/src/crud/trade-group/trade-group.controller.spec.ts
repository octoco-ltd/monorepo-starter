import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DBModule, TradeGroupService } from '@octoco/models';
import request from 'supertest';
import { TradeGroupController } from './trade-group.controller';

describe('TradeGroupController', () => {
  let app: INestApplication;
  let tradeGroupService: TradeGroupService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      controllers: [TradeGroupController],
      providers: [TradeGroupService],
    }).compile();

    tradeGroupService = module.get(TradeGroupService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // enable validation
    await app.init();
  }, 60000);

  afterAll(async () => {
    app && (await app.close());
  });

  describe('POST /trade-group', () => {
    it('should 400 on invalid input', async () => {
      return request(app.getHttpServer())
        .post('/trade-group')
        .send({
          invalid: 'field',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should 201 an return created trade-group on valid input', async () => {
      const res = await request(app.getHttpServer())
        .post('/trade-group')
        .send({ name: 'test-trade-group' })
        .expect(HttpStatus.CREATED);

      const tradeGroup = await tradeGroupService.findById(res.body.id);
      expect(tradeGroup.name).toEqual(res.body.name);
    });
  });

  describe('GET /trade-group', () => {
    it('should 200 with all trade-groups', async () => {
      const tradeGroup1 = await tradeGroupService.create({
        name: 'trade-group-1',
      });
      const tradeGroup2 = await tradeGroupService.create({
        name: 'trade-group-2',
      });

      const res = await request(app.getHttpServer())
        .get('/trade-group')
        .expect(HttpStatus.OK);
      expect(res.body).toContainEqual(JSON.parse(JSON.stringify(tradeGroup1)));
      expect(res.body).toContainEqual(JSON.parse(JSON.stringify(tradeGroup2)));
    });
  });

  describe('GET /trade-group/:id', () => {
    it('should 404 if no trade-group found', async () => {
      return request(app.getHttpServer())
        .get('/trade-group/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and return trade-group if found', async () => {
      const tradeGroup = await tradeGroupService.create({
        name: 'trade-group',
      });

      const res = await request(app.getHttpServer())
        .get(`/trade-group/${tradeGroup.id}`)
        .expect(HttpStatus.OK);
      expect(res.body.name).toEqual(tradeGroup.name);
    });
  });

  describe('PATCH /trade-group/:id', () => {
    it('should 404 if no trade-group found', async () => {
      return request(app.getHttpServer())
        .patch('/trade-group/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and return updated trade-group if found', async () => {
      const tradeGroup = await tradeGroupService.create({
        name: 'trade-group',
      });

      const res = await request(app.getHttpServer())
        .patch(`/trade-group/${tradeGroup.id}`)
        .send({ name: 'modified-trade-group' })
        .expect(HttpStatus.OK);

      const tradeGroup2 = await tradeGroupService.findById(tradeGroup.id);
      expect(tradeGroup2.name).toEqual('modified-trade-group');
      expect(res.body).toEqual(JSON.parse(JSON.stringify(tradeGroup2)));
    });
  });

  describe('DELETE /trade-group/:id', () => {
    it('should 404 if no trade-group found', async () => {
      return request(app.getHttpServer())
        .delete('/trade-group/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and delete trade-group if found', async () => {
      const tradeGroup = await tradeGroupService.create({
        name: 'trade-group',
      });

      await request(app.getHttpServer())
        .delete(`/trade-group/${tradeGroup.id}`)
        .expect(HttpStatus.OK);

      expect(await tradeGroupService.findById(tradeGroup.id)).toBeNull();
    });
  });
});
