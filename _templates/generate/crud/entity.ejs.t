---
to: packages/@octoco/models/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.entity.ts
---
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class <%=h.changeCase.pascalCase(name)%> {
  @PrimaryKey()
  _id!: ObjectId;

  @ApiProperty({
    description: 'The unique internal ID of the <%=h.changeCase.noCase(name)%>.',
    type: String,
  })
  @SerializedPrimaryKey()
  id!: string;

  @ApiProperty({
    description: 'The name of the <%=h.changeCase.noCase(name)%>.',
    type: String,
  })
  @Property()
  name: string;
}
