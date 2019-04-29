import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateCardDto } from '../cards/dto/createCard.dto';
import { CardsService } from '../cards/cards.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  async create() {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';
    return this.walletsService.create(userId);
  }

  @Get()
  async getWallets() {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';

    return this.walletsService.getByUserId(userId);
  }

  @Get(':id')
  async getWalletById(@Param('id') walletId: string) {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';

    const wallet = await this.walletsService.getById(walletId);
    if (!wallet) {
      throw new NotFoundException();
    }

    // todo: check if user is owner of wallet our admin user
    if (wallet.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    return wallet;
  }
}
