import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { MongoIdValidation } from '../helpers/mongoIdValidation';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signUp(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get('/:id')
  async getUser(@Param() params: MongoIdValidation) {
    const user = await this.usersService.get(params.id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  async listUsers() {
    return this.usersService.index();
  }
}
