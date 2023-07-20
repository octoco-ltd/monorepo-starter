import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Prisma, Meter } from '@prisma/client';

@Injectable()
export class MeterService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MeterCreateInput): Promise<Meter> {
    return this.prisma.meter.create({ data });
  }

  async get(id: string): Promise<Meter | null> {
    return this.prisma.meter.findUnique({
      where: { id },
    });
  }

  async find(where: Prisma.MeterWhereInput): Promise<Meter[]> {
    return this.prisma.meter.findMany({ where });
  }

  async update(
    id: string,
    data: Prisma.MeterUpdateInput
  ): Promise<Meter | null> {
    return this.prisma.meter.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Meter | null> {
    return this.prisma.meter.delete({
      where: { id },
    });
  }
}
