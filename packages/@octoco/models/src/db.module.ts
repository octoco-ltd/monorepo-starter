import { ReflectMetadataProvider } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Inject, Module } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TradeGroup, User } from '.';

const DB_CLEANUP_FN = Symbol('DB_CLEANUP_FN');
type DBCleanupFn = () => Promise<void>;

export interface DBConfig {
  // Connection string for connecting to an external mongo database.
  databaseUrl?: string;

  // Set true to connect to an in-memory instance of mongo instead.
  useInMemoryDb?: boolean;
}

@Module({})
export class DBModule {
  constructor(@Inject(DB_CLEANUP_FN) public readonly cleanupFn: DBCleanupFn) {}

  static async forRoot(cfg: DBConfig): Promise<DynamicModule> {
    let cleanupFn: DBCleanupFn;
    let databaseUrl = cfg.databaseUrl || '';

    // option of using a temp in-memory db:
    if (cfg.useInMemoryDb) {
      const mongod = await MongoMemoryServer.create();
      databaseUrl = mongod.getUri();
      cleanupFn = async () => {
        await mongod.stop({
          doCleanup: true,
        });
      };
    }

    return {
      module: DBModule,
      providers: [
        {
          provide: DB_CLEANUP_FN,
          useValue: cleanupFn,
        },
      ],
      imports: [
        MikroOrmModule.forRoot({
          metadataProvider: ReflectMetadataProvider,
          clientUrl: databaseUrl,
          dbName: 'octoco-monorepo',
          type: 'mongo',
          entities: [User, TradeGroup],
        }),
      ],
    };
  }

  // automatic clean-up on shutdown:
  async onModuleDestroy() {
    this.cleanupFn && (await this.cleanupFn());
  }
}
