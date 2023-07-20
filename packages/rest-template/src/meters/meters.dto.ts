import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Meter } from '@prisma/client';

// NOTE: Prisma generates typescript types for all models in the schema.prisma
//   when you run 'prisma generate'. Unfortunately that means we can't annotate
//   prisma-generated types directly, and have to convert to/from a DTO class
//   by hand. We can either automate this or just use another ORM.
export class MeterDTO {
  @ApiProperty({
    description: 'The unique ID of the meter.',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The name of the meter.',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The model of the meter.',
    type: String,
  })
  model: string;

  @ApiProperty({
    description: 'The time this meter record was created.',
    type: Date,
  })
  tsCreated: Date;

  @ApiProperty({
    description: 'The time this meter record was last updated.',
    type: Date,
  })
  tsModified: Date;
}

export function convertMeterToDTO(meter: Meter): MeterDTO {
  return {
    id: meter.id,
    name: meter.name,
    model: meter.model,
    tsCreated: meter.tsCreated,
    tsModified: meter.tsModified,
  };
}

export class CreateMeterRequest {
  @ApiProperty({
    description: 'The name of the meter being created.',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The model of the meter being created.',
    type: String,
  })
  model: string;
}

export class FindMeterRequest {
  @ApiPropertyOptional({
    description: 'Return all meters with this name.',
    type: String,
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Return all meters with this model.',
    type: String,
  })
  model?: string;
}

export class FindMeterResponse {
  @ApiProperty({
    description: 'The list of matching meters.',
    type: [MeterDTO],
  })
  meters: MeterDTO[];
}
