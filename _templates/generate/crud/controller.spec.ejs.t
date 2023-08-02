---
to: packages/@octoco/rest/src/crud/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.controller.spec.ts
---
import { Test, TestingModule } from '@nestjs/testing';
import { <%=h.changeCase.pascalCase(name)%>Controller } from './<%=h.changeCase.paramCase(name)%>.controller';
import {
  DBModule,
  TeardownFn,
  <%=h.changeCase.pascalCase(name)%>Service,
} from '@octoco/models';
import { DynamicModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

describe('<%=h.changeCase.pascalCase(name)%>Controller', () => {
  // test state
  let c: <%=h.changeCase.pascalCase(name)%>Controller;
  let orm: MikroORM;

  // db state
  let dbModule: DynamicModule;
  let teardown: TeardownFn;

  beforeEach(async () => {
    [dbModule, teardown] = await DBModule.connectForTesting();

    // inject the test db into our controller
    const module: TestingModule = await Test.createTestingModule({
      controllers: [<%=h.changeCase.pascalCase(name)%>Controller],
      providers: [<%=h.changeCase.pascalCase(name)%>Service],
      imports: [dbModule],
    }).compile();

    c = module.get<<%=h.changeCase.pascalCase(name)%>Controller>(<%=h.changeCase.pascalCase(name)%>Controller);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await teardown();
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(c).toBeDefined();
  });
});
