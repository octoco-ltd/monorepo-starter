import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MeterService } from './meters.service';
import {
  CreateMeterRequest,
  FindMeterRequest,
  FindMeterResponse,
} from './meters.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rest-template')
@Controller('meters')
export class MeterController {
  constructor(private readonly meterService: MeterService) {}

  @Post()
  @ApiOkResponse({
    description: 'Creates a meter record with the given data.',
  })
  async createMeter(@Body() body: CreateMeterRequest): Promise<void> {
    const now = new Date();
    await this.meterService.create({
      name: body.name,
      model: body.model,
      tsCreated: now,
      tsModified: now,
    });
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns the list of matching meter records.',
    type: FindMeterResponse,
  })
  async findMeter(
    @Query() query: FindMeterRequest
  ): Promise<FindMeterResponse> {
    if (!query.name && !query.model) {
      throw new Error(
        'Either a name or a model must be provided as a query parameter.'
      );
    }

    const meters = await this.meterService.find({
      name: query.name ?? undefined,
      model: query.model ?? undefined,
    });

    return { meters };
  }
}
