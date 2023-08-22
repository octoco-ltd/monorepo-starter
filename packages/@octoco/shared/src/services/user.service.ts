import { EntityManager, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { User } from '../entities';

@Injectable()
export class UserService {
  private readonly repo: EntityRepository<User>;

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    this.repo = em.getRepository(User);
  }

  @UseRequestContext()
  async create(data: CreateUserDto) {
    const user = this.repo.create(data);
    await this.em.flush();
    return user;
  }

  @UseRequestContext()
  async findById(id: string) {
    return await this.repo.findOne({
      id,
    });
  }

  @UseRequestContext()
  async addRoles(id: string, roles: string[]) {
    const user = await this.repo.findOneOrFail({ id });
    user.roles = merge(user.roles, roles);
    await this.em.flush();
  }

  @UseRequestContext()
  async removeRoles(id: string, roles: string[]) {
    const user = await this.repo.findOneOrFail({ id });
    user.roles = user.roles.filter((role) => roles.indexOf(role) === -1);
    await this.em.flush();
  }

  @UseRequestContext()
  async remove(id: string) {
    this.em.remove(await this.repo.findOneOrFail(id));
    await this.em.flush();
  }
}

// TODO: move helpers into auth module
function merge<T>(x: T[], y: T[]): T[] {
  return Array.from(new Set([...x, ...y]).values());
}
