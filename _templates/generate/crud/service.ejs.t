---
to: packages/@octoco/models/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.service.ts
---
import { Injectable } from '@nestjs/common';
import { Create<%=h.changeCase.pascalCase(name)%>Dto, Update<%=h.changeCase.pascalCase(name)%>Dto } from './<%=h.changeCase.paramCase(name)%>.dto';
import { <%=h.changeCase.pascalCase(name)%> } from './<%=h.changeCase.paramCase(name)%>.entity';
import { EntityRepository } from '@mikro-orm/mongodb';
import {
  EntityManager,
  MikroORM,
  UseRequestContext,
  wrap,
} from '@mikro-orm/core';

// Business logic should be handler by the service.

@Injectable()
export class <%=h.changeCase.pascalCase(name)%>Service {
  private readonly repo: EntityRepository<<%=h.changeCase.pascalCase(name)%>>;

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    this.repo = em.getRepository(<%=h.changeCase.pascalCase(name)%>);
  }

  @UseRequestContext()
  async create(data: Create<%=h.changeCase.pascalCase(name)%>Dto): Promise<<%=h.changeCase.pascalCase(name)%>> {
    const now = new Date();
    const <%=h.changeCase.camelCase(name)%> = this.repo.create({
      ...data,
      createdAt: now,
      lastUpdatedAt: now,
    });
    await this.em.flush();
    return <%=h.changeCase.camelCase(name)%>;
  }

  @UseRequestContext()
  async findAll(): Promise<<%=h.changeCase.pascalCase(name)%>[]> {
    return await this.repo.findAll();
  }

  @UseRequestContext()
  async findById(id: string): Promise<<%=h.changeCase.pascalCase(name)%> | null> {
    return await this.repo.findOne({
      id,
    });
  }

  @UseRequestContext()
  async update(id: string, data: Update<%=h.changeCase.pascalCase(name)%>Dto): Promise<<%=h.changeCase.pascalCase(name)%>> {
    const now = new Date();
    const <%=h.changeCase.camelCase(name)%> = wrap(await this.repo.findOneOrFail(id)).assign({
      ...data,
      lastUpdatedAt: data.leaveLastUpdated ? undefined : now,
    });
    await this.em.flush();
    return <%=h.changeCase.camelCase(name)%>;
  }

  @UseRequestContext()
  async remove(id: string) {
    this.em.remove(await this.repo.findOneOrFail(id));
    await this.em.flush();
  }
}
