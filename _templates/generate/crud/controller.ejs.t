---
to: packages/@octoco/rest/src/crud/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  Create<%=h.changeCase.pascalCase(name)%>Dto,
  <%=h.changeCase.pascalCase(name)%>,
  <%=h.changeCase.pascalCase(name)%>Service,
  Update<%=h.changeCase.pascalCase(name)%>Dto,
} from '@octoco/models';

@Controller('<%=h.changeCase.paramCase(name)%>')
export class <%=h.changeCase.pascalCase(name)%>Controller {
  constructor(private readonly <%=h.changeCase.camelCase(name)%>Service: <%=h.changeCase.pascalCase(name)%>Service) {}

  @Post()
  @ApiOkResponse({
    description: 'The newly created <%=h.changeCase.noCase(name)%> record.',
    type: <%=h.changeCase.pascalCase(name)%>,
  })
  create(@Body() data: Create<%=h.changeCase.pascalCase(name)%>Dto) {
    return this.<%=h.changeCase.camelCase(name)%>Service.create(data);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The <%=h.changeCase.noCase(name)%> record with the given ID.',
    type: <%=h.changeCase.pascalCase(name)%>,
  })
  @ApiNotFoundResponse({
    description: 'No <%=h.changeCase.noCase(name)%> was found with the given ID.',
  })
  findById(@Param('id') id: string) {
    return this.<%=h.changeCase.camelCase(name)%>Service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Update<%=h.changeCase.pascalCase(name)%>Dto) {
    return this.<%=h.changeCase.camelCase(name)%>Service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.<%=h.changeCase.camelCase(name)%>Service.remove(id);
  }
}
