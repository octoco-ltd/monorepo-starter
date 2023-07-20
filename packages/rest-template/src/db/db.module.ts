import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

const dbModuleSpec = {
  providers: [PrismaService],
  exports: [PrismaService],
};

@Module(dbModuleSpec)
export class DbModule {}

export async function createTestDbModule(): Promise<
  [DynamicModule, () => Promise<void>]
> {
  const mongo = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      storageEngine: 'wiredTiger',
    },
  });

  const url = mongo.getUri('rest-template');
  return [
    {
      ...dbModuleSpec,
      module: DbModule,
      providers: [
        {
          provide: PrismaService,
          useValue: new PrismaService({
            datasources: {
              db: {
                url,
              },
            },
          }),
        },
      ],
    },
    mongo.stop.bind(mongo),
  ];
}
