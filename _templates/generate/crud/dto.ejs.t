---
to: packages/@octoco/models/src/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.dto.ts
---
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class Create<%=h.changeCase.pascalCase(name)%>Dto {
  @ApiProperty({
    description: 'Name of the <%=h.changeCase.noCase(name)%>.',
    type: String,
  })
  name: string;
}

export class Update<%=h.changeCase.pascalCase(name)%>Dto extends PartialType(Create<%=h.changeCase.pascalCase(name)%>Dto) {
  // add update-specific inputs in here
}
