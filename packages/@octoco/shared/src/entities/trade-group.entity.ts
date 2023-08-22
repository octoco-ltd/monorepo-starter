import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class TradeGroup {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  @ApiProperty({
    description: 'The unique internal ID of the trade-group.',
    type: String,
  })
  id!: string;

  @Property()
  @ApiProperty({
    description: 'The name of the trade-group.',
    type: String,
  })
  name: string;

  /**
   * Internal metadata:
   */

  @Property()
  @Exclude()
  createdAt: Date;

  @Property()
  @Exclude()
  lastUpdatedAt: Date;
}
