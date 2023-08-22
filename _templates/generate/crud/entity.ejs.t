---
to: packages/@octoco/shared/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.entity.ts
---
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

// Properties of the domain entity are defined here. Property transformers
// from the 'class-transformer' library are picked up by NestJS and applied
// during serialisation in the rest API, so you can exclude or otherwise
// change properties before they're sent to a user.

@Entity()
export class <%=h.changeCase.pascalCase(name)%> {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  @ApiProperty({
    description: 'The unique internal ID of the <%=h.changeCase.paramCase(name)%>.',
    type: String,
  })
  id!: string;

  @Property()
  @ApiProperty({
    description: 'The name of the <%=h.changeCase.paramCase(name)%>.',
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
