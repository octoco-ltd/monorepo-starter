import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryKey()
  _id!: ObjectId;

  @ApiProperty({
    description: "The user's unique internal ID.",
    type: String,
  })
  @SerializedPrimaryKey()
  id!: string;

  @ApiProperty({
    description: "The user's email address.",
    type: String,
  })
  @Property({ unique: true })
  email: string;

  @ApiProperty({
    description: "The user's authorisation roles.",
    type: [String],
  })
  @Property()
  roles: string[];
}
