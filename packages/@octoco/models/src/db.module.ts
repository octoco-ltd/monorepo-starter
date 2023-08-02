import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { DynamicModule, Module } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

export type TeardownFn = () => Promise<void>;

@Module({})
export class DBModule {
  static connect(): DynamicModule {
    return this._connect(process.env.DATABASE_URL);
  }

  static async connectForTesting(): Promise<[DynamicModule, TeardownFn]> {
    // You can't easily run mongo in alpine containers, so for CI you can set
    // this environment variable to connect to a bitbucket mongo service:
    if (process.env.DATABASE_TEST_URL) {
      return [
        this._connect(process.env.DATABASE_URL),
        async () => {} /* eslint-disable-line */,
      ];
    }

    // For local dev we just use an in-memory mongo server:
    const mongod = await MongoMemoryServer.create();
    return [this._connect(mongod.getUri()), mongod.stop.bind(mongod)];
  }

  private static _connect(connStr: string): DynamicModule {
    return {
      module: DBModule,
      imports: [
        MikroOrmModule.forRoot({
          metadataProvider: TsMorphMetadataProvider,
          clientUrl: connStr,
          dbName: 'monorepo-starter',
          type: 'mongo',

          // Discover entity classes automatically:
          baseDir: __dirname,
          entities: ['**/*.entity.js', '**/*.entity.d.ts', '**/*.entity.ts'],
          tsNode: false,
        }),
      ],
    };
  }
}
