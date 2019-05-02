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
import { CreateCardDto } from './dto/createCard.dto';
import { CardsService } from './cards.service';
import { WalletsService } from '../wallets/wallets.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly walletsService: WalletsService,
  ) {}

  @Post()
  async createCard(@Body() card: CreateCardDto) {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';

    const wallet = await this.walletsService.getById(card.wallet);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // todo: check if user is owner of wallet our admin user
    if (wallet.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    const cardCreated = await this.cardsService.create(card, wallet.id, userId);
    await this.walletsService.addCard(wallet.id, cardCreated.id);
    return cardCreated;
  }

  @Get()
  async getCards() {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';

    // todo: if admin query all cards

    return this.cardsService.getByUserId(userId);
  }

  @Get(':id')
  async getCard(@Param() params: MongoIdValidation) {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';

    const card = await this.cardsService.findById(params.id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // todo: check if user is owner of wallet our admin user
    if (card.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    return card;
  }

  @Delete(':id')
  async deleteCard(@Param() params: MongoIdValidation) {
    // todo: change to user auth user id
    const userId = '5cc4f2424cd7977d263fc2c0';

    const card = await this.cardsService.findById(params.id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // todo: check if user is owner of wallet our admin user
    if (card.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    await this.walletsService.deleteCard(card.wallet.id, card.id);
    await this.cardsService.delete(card.id);

    return {
      statusCode: 200,
      message: 'Card has been deleted',
    };
  }
}
