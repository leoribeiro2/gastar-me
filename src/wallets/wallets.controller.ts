import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateCardDto } from './dto/createCard.dto';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
  ) {}

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
    return this.walletsService.getById(walletId, userId);
  }

  @Post(':id/cards')
  async addCard(@Param('id') walletId: string, @Body() card: CreateCardDto) {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';
    return this.walletsService.addCard(userId, walletId, card);
  }

  @Delete(':id/cards/:cardId')
  async deleteCard(@Param('id') walletId: string, @Param('cardId') cardId: string) {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';
    return this.walletsService.deleteCard(userId, walletId, cardId);
  }
}
