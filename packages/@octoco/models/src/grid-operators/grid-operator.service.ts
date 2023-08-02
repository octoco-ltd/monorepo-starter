import { Injectable } from '@nestjs/common';
import {
  CreateGridOperatorDto,
  UpdateGridOperatorDto,
} from './grid-operator.dto';
import { GridOperator } from './grid-operator.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';

@Injectable()
export class GridOperatorService {
  private readonly repo: EntityRepository<GridOperator>;

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    this.repo = em.getRepository(GridOperator);
  }

  @UseRequestContext()
  async create(data: CreateGridOperatorDto): Promise<GridOperator> {
    const gridOperator = this.repo.create(data);
    await this.em.flush();
    return gridOperator;
  }

  @UseRequestContext()
  async findAll(): Promise<GridOperator[]> {
    return await this.repo.findAll();
  }

  @UseRequestContext()
  async findById(id: string): Promise<GridOperator | null> {
    return await this.repo.findOne({
      id,
    });
  }

  @UseRequestContext()
  async update(id: string, data: UpdateGridOperatorDto): Promise<GridOperator> {
    const gridOperator = wrap(await this.repo.findOneOrFail(id)).assign(data);
    await this.em.flush();
    return gridOperator;
  }

  @UseRequestContext()
  async remove(id: string) {
    this.em.remove(await this.repo.findOneOrFail(id));
    await this.em.flush();
  }
}
