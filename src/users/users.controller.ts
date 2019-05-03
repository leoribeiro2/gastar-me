import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  async signUp(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req) {
    const userId = req.user._id;

    const user = await this.usersService.get(userId);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
}
