import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

// Input types for the service are defined here. Property validators from the
// 'class-validator' library are picked up by NestJS and checked before calling
// a handler, so you can do validation here.

export class CreateTradeGroupDto {
  @IsDefined()
  @ApiProperty({
    description: 'Name of the trade-group.',
    type: String,
  })
  name: string;
}

// You can use NestJS 'mapped-types' to transform DTO classes...
export class UpdateTradeGroupDto extends PartialType(CreateTradeGroupDto) {
  // ...and add additional properties in here:
  @IsOptional()
  @ApiProperty({
    description: "Leaves the record's lastUpdated field untouched if set.",
    type: Boolean,
  })
  leaveLastUpdated?: boolean;
}
