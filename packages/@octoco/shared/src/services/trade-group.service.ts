import {
  EntityManager,
  MikroORM,
  UseRequestContext,
  wrap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { CreateTradeGroupDto, UpdateTradeGroupDto } from '../dtos';
import { TradeGroup } from '../entities';

@Injectable()
export class TradeGroupService {
  private readonly repo: EntityRepository<TradeGroup>;

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    this.repo = em.getRepository(TradeGroup);
  }

  @UseRequestContext()
  async create(data: CreateTradeGroupDto): Promise<TradeGroup> {
    const now = new Date();
    const tradeGroup = this.repo.create({
      ...data,
      createdAt: now,
      lastUpdatedAt: now,
    });
    await this.em.flush();
    return tradeGroup;
  }

  @UseRequestContext()
  async findAll(): Promise<TradeGroup[]> {
    return await this.repo.findAll();
  }

  @UseRequestContext()
  async findById(id: string): Promise<TradeGroup | null> {
    return await this.repo.findOne({
      id,
    });
  }

  @UseRequestContext()
  async update(id: string, data: UpdateTradeGroupDto): Promise<TradeGroup> {
    const now = new Date();
    const tradeGroup = wrap(await this.repo.findOneOrFail(id)).assign({
      ...data,
      lastUpdatedAt: data.leaveLastUpdated ? undefined : now,
    });
    await this.em.flush();
    return tradeGroup;
  }

  @UseRequestContext()
  async remove(id: string) {
    this.em.remove(await this.repo.findOneOrFail(id));
    await this.em.flush();
  }
}
