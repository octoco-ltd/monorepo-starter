import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, DBModule, UserService } from '@octoco/models';
import request from 'supertest';
import { UserController } from './user.controller.js';

const validUserInput: CreateUserDto = {
  email: 'test@octoco.ltd',
  roles: [],
};

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule.forRoot({
          databaseUrl: process.env.DATABASE_TEST_URL,
          useInMemoryDb: !process.env.DATABASE_TEST_URL,
        }),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = module.get(UserService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }, 60000);

  afterAll(async () => {
    app && (await app.close());
  });

  describe('POST /user', () => {
    it('should 400 on invalid input', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          invalid: 'field',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should 201 and return created user on valid input', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(validUserInput)
        .expect(HttpStatus.CREATED);

      const user = await userService.findById(res.body.id);
      expect(user.email).toEqual('test@octoco.ltd');
      expect(user.roles).toEqual([]);
    });
  });

  describe('GET /user/:id', () => {
    it('should 404 if no user found', async () => {
      return request(app.getHttpServer())
        .get('/user/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and return user if user is found', async () => {
      const user = await userService.create(validUserInput);

      const res = await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(HttpStatus.OK);
      expect(res.body.email).toEqual(user.email);
      expect(res.body.roles).toEqual(user.roles);
    });
  });

  describe('DELETE /user/:id', () => {
    it('should 404 if no user found', async () => {
      return request(app.getHttpServer())
        .delete('/user/does-not-exist')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should 200 and delete user if user is found', async () => {
      const user = await userService.create(validUserInput);

      await request(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .expect(HttpStatus.OK);

      expect(await userService.findById(user.id)).toBeNull();
    });
  });
});
