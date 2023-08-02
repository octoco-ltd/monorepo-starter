import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGridOperatorDto {
  @ApiProperty({
    description: 'Name of the grid operator.',
    type: String,
  })
  name: string;
}

export class UpdateGridOperatorDto extends PartialType(CreateGridOperatorDto) {
  // add update-specific inputs in here
}
