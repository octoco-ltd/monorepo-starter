import { NotFoundError } from '@mikro-orm/core'; // bad guy, catch in svc
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto, User, UserService } from '@octoco/models';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The newly created user record.',
    type: User,
  })
  async create(@Body() data: CreateUserDto) {
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
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (user === null) {
      throw new NotFoundException();
    }

    return user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException();
      }
      throw err;
    }
  }
}
