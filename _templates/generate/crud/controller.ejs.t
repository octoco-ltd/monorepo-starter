---
to: packages/@octoco/rest/src/crud/<%=h.changeCase.paramCase(name)%>/<%=h.changeCase.paramCase(name)%>.controller.ts
---
import { NotFoundError } from '@mikro-orm/core'; // bad, catch in svc layer
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  Create<%=h.changeCase.pascalCase(name)%>Dto,
  <%=h.changeCase.pascalCase(name)%>,
  <%=h.changeCase.pascalCase(name)%>Service,
  Update<%=h.changeCase.pascalCase(name)%>Dto,
} from '@octoco/shared';
import { Auth } from '../../auth/auth.decorator';

// Rest endpoints are defined and handled by the controller. Decorators do all
// of the work for setting endpoint properties, auth guards, API docs, etc.

@Controller('<%=h.changeCase.paramCase(name)%>')
export class <%=h.changeCase.pascalCase(name)%>Controller {
  constructor(private readonly <%=h.changeCase.camelCase(name)%>Service: <%=h.changeCase.pascalCase(name)%>Service) {}

  @Post()
  @Auth('create', <%=h.changeCase.pascalCase(name)%>)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create <%=h.changeCase.paramCase(name)%>s.',
    description: 'Creates a new <%=h.changeCase.paramCase(name)%> record in the database.',
  })
  @ApiCreatedResponse({
    description: 'The newly created <%=h.changeCase.paramCase(name)%> record.',
    type: <%=h.changeCase.pascalCase(name)%>,
  })
  async create(@Body() data: Create<%=h.changeCase.pascalCase(name)%>Dto) {
    return this.<%=h.changeCase.camelCase(name)%>Service.create(data);
  }

  @Get()
  @Auth('read', <%=h.changeCase.pascalCase(name)%>)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all <%=h.changeCase.paramCase(name)%>s.',
    description: 'Returns all <%=h.changeCase.paramCase(name)%>s in the database.',
  })
  @ApiOkResponse({
    description: 'The list of all <%=h.changeCase.paramCase(name)%> records.',
    type: [<%=h.changeCase.pascalCase(name)%>],
  })
  async findAll(): Promise<<%=h.changeCase.pascalCase(name)%>[]> {
    return this.<%=h.changeCase.camelCase(name)%>Service.findAll();
  }

  @Get(':id')
  @Auth('read', <%=h.changeCase.pascalCase(name)%>)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch a <%=h.changeCase.paramCase(name)%>.',
    description: 'Returns the <%=h.changeCase.paramCase(name)%> with the specified id.',
  })
  @ApiOkResponse({
    description: 'The <%=h.changeCase.paramCase(name)%> record with the given id.',
    type: <%=h.changeCase.pascalCase(name)%>,
  })
  @ApiNotFoundResponse({
    description: 'No <%=h.changeCase.paramCase(name)%> was found with the given id.',
  })
  async findById(@Param('id') id: string) {
    const go = await this.<%=h.changeCase.camelCase(name)%>Service.findById(id);
    if (go == null) {
      throw new NotFoundException();
    }

    return go;
  }

  @Patch(':id')
  @Auth('update', <%=h.changeCase.pascalCase(name)%>)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a <%=h.changeCase.paramCase(name)%>.',
    description: 'Updates the <%=h.changeCase.paramCase(name)%> with the given id.',
  })
  @ApiOkResponse({
    description: 'The updated <%=h.changeCase.paramCase(name)%> record.',
    type: <%=h.changeCase.pascalCase(name)%>,
  })
  @ApiNotFoundResponse({
    description: 'No <%=h.changeCase.paramCase(name)%> was found with the given id.',
  })
  async update(@Param('id') id: string, @Body() data: Update<%=h.changeCase.pascalCase(name)%>Dto) {
    let new<%=h.changeCase.pascalCase(name)%>: <%=h.changeCase.pascalCase(name)%>;
    try {
      new<%=h.changeCase.pascalCase(name)%> = await this.<%=h.changeCase.camelCase(name)%>Service.update(id, data);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException();
      }
      throw err;
    }

    return new<%=h.changeCase.pascalCase(name)%>;
  }

  @Delete(':id')
  @Auth('destroy', <%=h.changeCase.pascalCase(name)%>)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a <%=h.changeCase.paramCase(name)%>.',
    description: 'Deletes the <%=h.changeCase.paramCase(name)%> with the given id.',
  })
  @ApiOkResponse({
    description: 'The <%=h.changeCase.paramCase(name)%> was deleted.',
  })
  @ApiNotFoundResponse({
    description: 'No <%=h.changeCase.paramCase(name)%> was found with the given id.',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.<%=h.changeCase.camelCase(name)%>Service.remove(id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException();
      }
      throw err;
    }
  }
}
