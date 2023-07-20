import { MeterController } from './meters.controller';
import { MeterService } from './meters.service';
import { createTestDbModule } from '../db/db.module';
import { Test } from '@nestjs/testing';
import { DynamicModule } from '@nestjs/common';

describe('MeterController', () => {
  let dbModule: DynamicModule;
  let dbModuleTeardownFn: () => Promise<void>;
  let meterController: MeterController;

  beforeAll(async () => {
    [dbModule, dbModuleTeardownFn] = await createTestDbModule();
    const app = await Test.createTestingModule({
      providers: [MeterService],
      controllers: [MeterController],
      imports: [dbModule],
    }).compile();

    meterController = app.get(MeterController);
  });

  afterAll(async () => {
    await dbModuleTeardownFn();
  });

  describe('create', () => {
    it('should successfully create a meter record', async () => {
      await meterController.createMeter({
        name: 'meter1',
        model: 'model1',
      });
    });
  });

  describe('find', () => {
    it('should fail if no query is given', () => {
      expect(async () => await meterController.findMeter({})).rejects.toThrow();
    });

    it('should find a meter with a matching name', async () => {
      await meterController.createMeter({
        name: 'meter2',
        model: 'model2',
      });

      const res = await meterController.findMeter({ name: 'meter2' });
      expect(res.meters.length).toBe(1);
    });

    it('should find a meter with a matching name', async () => {
      await meterController.createMeter({
        name: 'meter3',
        model: 'model3',
      });

      const res = await meterController.findMeter({ model: 'model3' });
      expect(res.meters.length).toBe(1);
    });

    it('should return nothing if nothing matches', async () => {
      await meterController.createMeter({
        name: 'meter4',
        model: 'model4',
      });

      const res = await meterController.findMeter({ name: 'lol' });
      expect(res.meters.length).toBe(0);
    });
  });
});
