import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../modules';
import { TradeGroupService, UserService } from '../services';

// For testing services quickly.
export class TestEnv {
  constructor(
    public tradeGroupService: TradeGroupService,
    public userService: UserService,
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
