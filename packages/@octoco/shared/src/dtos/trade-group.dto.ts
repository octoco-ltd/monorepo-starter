import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

export class CreateTradeGroupDto {
  @IsDefined()
  @ApiProperty({
    description: 'Name of the trade-group.',
    type: String,
  })
  name: string;
}

export class UpdateTradeGroupDto extends PartialType(CreateTradeGroupDto) {
  @IsOptional()
  @ApiProperty({
    description: "Leaves the record's lastUpdated field untouched if set.",
    type: Boolean,
  })
  leaveLastUpdated?: boolean;
}
