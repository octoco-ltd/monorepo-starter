import { NotFoundError } from '@mikro-orm/core'; // bad, catch in svc layer
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateTradeGroupDto,
  TradeGroup,
  TradeGroupService,
  UpdateTradeGroupDto,
} from '@octoco/shared';
import { Auth } from '../decorators/auth.decorator';

@Controller('trade-group')
export class TradeGroupController {
  constructor(private readonly tradeGroupService: TradeGroupService) {}

  @Post()
  @Auth('create', TradeGroup)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create trade-groups.',
    description: 'Creates a new trade-group record in the database.',
  })
  @ApiCreatedResponse({
    description: 'The newly created trade-group record.',
    type: TradeGroup,
  })
  async create(@Body() data: CreateTradeGroupDto) {
    return this.tradeGroupService.create(data);
  }

  @Get()
  @Auth('read', TradeGroup)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all trade-groups.',
    description: 'Returns all trade-groups in the database.',
  })
  @ApiOkResponse({
    description: 'The list of all trade-group records.',
    type: [TradeGroup],
  })
  async findAll(): Promise<TradeGroup[]> {
    return this.tradeGroupService.findAll();
  }

  @Get(':id')
  @Auth('read', TradeGroup)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch a trade-group.',
    description: 'Returns the trade-group with the specified id.',
  })
  @ApiOkResponse({
    description: 'The trade-group record with the given id.',
    type: TradeGroup,
  })
  @ApiNotFoundResponse({
    description: 'No trade-group was found with the given id.',
  })
  async findById(@Param('id') id: string) {
    const go = await this.tradeGroupService.findById(id);
    if (go == null) {
      throw new NotFoundException();
    }

    return go;
  }

  @Patch(':id')
  @Auth('update', TradeGroup)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a trade-group.',
    description: 'Updates the trade-group with the given id.',
  })
  @ApiOkResponse({
    description: 'The updated trade-group record.',
    type: TradeGroup,
  })
  @ApiNotFoundResponse({
    description: 'No trade-group was found with the given id.',
  })
  async update(@Param('id') id: string, @Body() data: UpdateTradeGroupDto) {
    let newTradeGroup: TradeGroup;
    try {
      newTradeGroup = await this.tradeGroupService.update(id, data);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException();
      }
      throw err;
    }

    return newTradeGroup;
  }

  @Delete(':id')
  @Auth('destroy', TradeGroup)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a trade-group.',
    description: 'Deletes the trade-group with the given id.',
  })
  @ApiOkResponse({
    description: 'The trade-group was deleted.',
  })
  @ApiNotFoundResponse({
    description: 'No trade-group was found with the given id.',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.tradeGroupService.remove(id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException();
      }
      throw err;
    }
  }
}
