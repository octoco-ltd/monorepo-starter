import { defineAbility } from '@casl/ability';
import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DBModule, UserService } from '@octoco/shared';
import request from 'supertest';
import { getConfigForTesting } from '../config';
import { AuthFn } from '../decorators/auth.decorator';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { FirebaseService } from '../services/firebase.service';
import { Ability, PolicyProvider } from '../services/policy.service';
import { AuthGuard } from './auth.guard';

// A mock resources we can protect with roles:
class ResourceA {}

// Mock controller with endpoints protected using the @Auth(...) decorator:
@Controller('auth-test')
class MockController {
  constructor() {}

  @Get('read-A')
  @AuthFn((ability) => ability.can('read', ResourceA))
  async testReadA() {}

  @Get('write-A')
  @AuthFn((ability) => ability.can('create', ResourceA))
  async testWriteA() {}
}

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let firebaseService: FirebaseService;
  let policyProvider: PolicyProvider;
  let authMiddleware: AuthMiddleware;

  beforeAll(async () => {
    policyProvider = new PolicyProvider(
      new Map([
        [
          'read-A',
          () =>
            defineAbility<Ability>((can) => {
              can('read', ResourceA);
            }),
        ],
        [
          'write-A',
          () =>
            defineAbility<Ability>((can) => {
              can('create', ResourceA);
            }),
        ],
        [
          'no-read-A',
          () =>
            defineAbility<Ability>((can, cannot) => {
              can('manage', ResourceA);
              cannot('read', ResourceA);
            }),
        ],
      ]),
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [getConfigForTesting],
        }),
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      controllers: [MockController],
      providers: [
        UserService,
        FirebaseService,
        PolicyProvider,
        AuthMiddleware,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    })
      .overrideProvider(PolicyProvider)
      .useValue(policyProvider)
      .compile();

    userService = module.get(UserService);
    firebaseService = module.get(FirebaseService);
    authMiddleware = module.get(AuthMiddleware);
    app = module.createNestApplication();
    app.use(authMiddleware.use.bind(authMiddleware)); // enable auth middleware
    await app.init();
  }, 60000);

  afterAll(async () => {
    app && (await app.close());
  });

  describe('AuthGuard', () => {
    it('no credentials should result in a 401', async () => {
      await request(app.getHttpServer())
        .get('/auth-test/read-A')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    // tests "can" policies
    it('role should access explicitly allowed resources', async () => {
      const user = await userService.create({
        email: 'read-A@octoco.ltd',
        roles: ['read-A'],
      });
      firebaseService.mock.mapTokenToUser('token-read-A', user);

      // read-A should be allowed
      await request(app.getHttpServer())
        .get('/auth-test/read-A')
        .set('Authorization', 'Bearer token-read-A')
        .expect(HttpStatus.OK);

      // write-A should be denied
      await request(app.getHttpServer())
        .get('/auth-test/write-A')
        .set('Authorization', 'Bearer token-read-A')
        .expect(HttpStatus.FORBIDDEN);
    });

    // tests "cannot" policies
    it('role should not access explicitly denied resources', async () => {
      const user = await userService.create({
        email: 'no-read-A@octoco.ltd',
        roles: ['no-read-A'],
      });
      firebaseService.mock.mapTokenToUser('token-no-read-A', user);

      // read-A should be denied
      await request(app.getHttpServer())
        .get('/auth-test/read-A')
        .set('Authorization', 'Bearer token-no-read-A')
        .expect(HttpStatus.FORBIDDEN);

      // write-A should be allowed
      await request(app.getHttpServer())
        .get('/auth-test/write-A')
        .set('Authorization', 'Bearer token-no-read-A')
        .expect(HttpStatus.OK);
    });

    // tests that having two roles allows you to access both's resources
    it('independent roles should be additive', async () => {
      const user = await userService.create({
        email: 'rw-A@octoco.ltd',
        roles: ['read-A', 'write-A'],
      });
      firebaseService.mock.mapTokenToUser('token-rw-A', user);

      // read-A should be allowed
      await request(app.getHttpServer())
        .get('/auth-test/read-A')
        .set('Authorization', 'Bearer token-rw-A')
        .expect(HttpStatus.OK);

      // write-A should be allowed
      await request(app.getHttpServer())
        .get('/auth-test/write-A')
        .set('Authorization', 'Bearer token-rw-A')
        .expect(HttpStatus.OK);
    });

    // tests that if one role denies a resource, but you have another role that
    // allows it, then you are allowed to access the resource
    it('dependent roles should be additive too', async () => {
      const user = await userService.create({
        email: 'nrw-A@octoco.ltd',
        roles: [
          'no-read-A', // this role denies reading A
          'read-A', // but this role allows it
        ],
      });
      firebaseService.mock.mapTokenToUser('token-nrw-A', user);

      // read-A should be allowed
      await request(app.getHttpServer())
        .get('/auth-test/read-A')
        .set('Authorization', 'Bearer token-nrw-A')
        .expect(HttpStatus.OK);

      // write-A should be allowed
      await request(app.getHttpServer())
        .get('/auth-test/write-A')
        .set('Authorization', 'Bearer token-nrw-A')
        .expect(HttpStatus.OK);
    });
  });
});
