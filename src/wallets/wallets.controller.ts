import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req) {
    const userId = req.user._id;

    return this.walletsService.create(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWallets(@Req() req) {
    const userId = req.user._id;

    return this.walletsService.getByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
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
