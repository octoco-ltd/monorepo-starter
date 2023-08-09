---
to: packages/@octoco/models/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.dto.ts
---
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

// Input types for the service are defined here. Property validators from the
// 'class-validator' library are picked up by NestJS and checked before calling
// a handler, so you can do validation here.

export class Create<%=h.changeCase.pascalCase(name)%>Dto {
  @IsDefined()
  @ApiProperty({
    description: 'Name of the <%=h.changeCase.paramCase(name)%>.',
    type: String,
  })
  name: string;
}

// You can use NestJS 'mapped-types' to transform DTO classes...
export class Update<%=h.changeCase.pascalCase(name)%>Dto extends PartialType(Create<%=h.changeCase.pascalCase(name)%>Dto) {
  // ...and add additional properties in here:
  @IsOptional()
  @ApiProperty({
    description: "Leaves the record's lastUpdated field untouched if set.",
    type: Boolean,
  })
  leaveLastUpdated?: boolean;
}
