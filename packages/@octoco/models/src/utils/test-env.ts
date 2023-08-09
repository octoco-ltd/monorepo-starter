import { Test, TestingModule } from '@nestjs/testing';
import { DBModule, TradeGroupService, UserService } from '..';

/**
 * Contains references to all of our CRUD services, and contains methods for
 * quickly creating entities and their dependencies during tests. Not to be
 * used in actual business logic.
 */
export class TestEnv {
  constructor(
    // Crud services:
    public tradeGroupService: TradeGroupService,
    public userService: UserService,

    // NestJS testing module:
    public module: TestingModule,
  ) {}

  static async construct(): Promise<TestEnv> {
    const module = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      providers: [TradeGroupService, UserService],
    }).compile();

    const tradeGroupService = module.get(TradeGroupService);
    const userService = module.get(UserService);

    return new TestEnv(tradeGroupService, userService, module);
  }

  // must be called after tests otherwise we leak memory
  async close() {
    this.module && (await this.module.close());
  }
}
