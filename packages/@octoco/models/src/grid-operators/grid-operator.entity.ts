import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GridOperator {
  @PrimaryKey()
  _id!: ObjectId;

  @ApiProperty({
    description: 'The unique internal ID of the grid operator.',
    type: String,
  })
  @SerializedPrimaryKey()
  id!: string;

  @ApiProperty({
    description: 'The name of the grid operator.',
    type: String,
  })
  @Property()
  name: string;
}
