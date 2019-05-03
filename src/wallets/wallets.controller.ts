import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ApiUseTags, ApiBearerAuth, ApiCreatedResponse, ApiUnauthorizedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('Wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ title: 'Create one wallet' })
  @ApiCreatedResponse({ description: 'Successfull create card'})
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  async create(@Req() req) {
    const userId = req.user._id;

    return this.walletsService.create(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ title: 'Get wallets' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Retrive all user wallets' })
  async getWallets(@Req() req) {
    const userId = req.user._id;

    return this.walletsService.getByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ title: 'Get one wallet by id' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Retrive wallet by id' })
  async getWalletById(@Param() params: MongoIdValidation, @Req() req) {
    const userId = req.user._id;

    const wallet = await this.walletsService.getById(params.id);
    if (!wallet) {
      throw new NotFoundException();
    }

    if (wallet.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    return wallet;
  }
}
