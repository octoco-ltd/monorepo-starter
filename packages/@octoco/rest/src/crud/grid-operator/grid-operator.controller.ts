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
  CreateGridOperatorDto,
  GridOperator,
  GridOperatorService,
  UpdateGridOperatorDto,
} from '@octoco/models';

@Controller('grid-operator')
export class GridOperatorController {
  constructor(private readonly gridOperatorService: GridOperatorService) {}

  @Post()
  @ApiOkResponse({
    description: 'The newly created grid operator record.',
    type: GridOperator,
  })
  async create(@Body() data: CreateGridOperatorDto) {
    return this.gridOperatorService.create(data);
  }

  @Get()
  @ApiOkResponse({
    description: 'The list of all grid operator records.',
    type: [GridOperator],
  })
  async findAll(): Promise<GridOperator[]> {
    return this.gridOperatorService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The grid operator record with the given ID.',
    type: GridOperator,
  })
  @ApiNotFoundResponse({
    description: 'No grid operator was found with the given ID.',
  })
  async findById(@Param('id') id: string) {
    return this.gridOperatorService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateGridOperatorDto) {
    return this.gridOperatorService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.gridOperatorService.remove(id);
  }
}
