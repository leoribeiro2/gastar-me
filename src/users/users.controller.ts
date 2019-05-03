import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ApiUseTags, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('Users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ title: 'Register a user' })
  @ApiCreatedResponse({ description: 'Successful user registred' })
  async signUp(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Get user information' })
  @ApiOkResponse({ description: 'Retrive user information' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
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
