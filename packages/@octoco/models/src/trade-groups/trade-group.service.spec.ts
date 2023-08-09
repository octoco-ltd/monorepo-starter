import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../db.module';
import { TradeGroupService } from './trade-group.service';

describe('TradeGroupService', () => {
  let tradeGroupService: TradeGroupService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      providers: [TradeGroupService],
    }).compile();

    tradeGroupService = module.get(TradeGroupService);
  }, 60000);

  afterAll(async () => {
    module && (await module.close());
  });

  describe('create', () => {
    it('should be able to create a TradeGroup', async () => {
      const tradeGroup = await tradeGroupService.create({ name: 'name' });
      expect(tradeGroup._id).not.toBeNull();
      expect(tradeGroup.id).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all the TradeGroups that have been created', async () => {
      const tradeGroup1 = await tradeGroupService.create({ name: 'name' });
      const tradeGroup2 = await tradeGroupService.create({ name: 'name' });
      const tradeGroups = await tradeGroupService.findAll();
      expect(tradeGroups.length).toBeGreaterThan(0);
      expect(tradeGroups).toContainEqual(tradeGroup1);
      expect(tradeGroups).toContainEqual(tradeGroup2);
    });
  });

  describe('findById', () => {
    it('should return null if the TradeGroup does not exist', async () => {
      expect(await tradeGroupService.findById('does-not-exist')).toBeNull();
    });

    it('should return the TradeGroup if it exists', async () => {
      const tradeGroup = await tradeGroupService.create({ name: 'name' });
      const tradeGroup2 = await tradeGroupService.findById(tradeGroup.id);
      expect(tradeGroup2).not.toBeNull();
      expect(tradeGroup2!.id).toEqual(tradeGroup.id);
    });
  });

  describe('update', () => {
    it('should throw if the TradeGroup does not exist', async () => {
      expect(tradeGroupService.update('does-not-exist', {})).rejects.toThrow();
    });

    it('should update the TradeGroup if it exists', async () => {
      const tradeGroup = await tradeGroupService.create({ name: 'name' });
      const tradeGroup2 = await tradeGroupService.update(tradeGroup.id, {
        name: 'new-name',
      });
      const tradeGroup3 = await tradeGroupService.findById(tradeGroup.id);
      expect(tradeGroup2.name).toEqual('new-name');
      expect(tradeGroup2).toEqual(tradeGroup3);
      expect(tradeGroup2).not.toEqual(tradeGroup);
    });
  });

  describe('remove', () => {
    it('should throw if the TradeGroup does not exist', async () => {
      expect(tradeGroupService.remove('does-not-exist')).rejects.toThrow();
    });

    it('should delete the TradeGroup if it exists', async () => {
      const tradeGroup = await tradeGroupService.create({ name: 'name' });
      expect(await tradeGroupService.findById(tradeGroup.id)).not.toBeNull();
      await tradeGroupService.remove(tradeGroup.id);
      expect(await tradeGroupService.findById(tradeGroup.id)).toBeNull();
    });
  });
});
