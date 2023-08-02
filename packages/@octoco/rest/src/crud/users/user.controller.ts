import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateUserDto, User, UserService } from '@octoco/models';

@Controller('<=h.changeCase.paramCase(name)')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({
    description: 'The newly created user record.',
    type: User,
  })
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The user record with the given ID.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'No user was found with the given ID.',
  })
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
