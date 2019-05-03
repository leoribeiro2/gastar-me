import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateCardDto } from './dto/createCard.dto';
import { CardsService } from './cards.service';
import { WalletsService } from '../wallets/wallets.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ApiUseTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly walletsService: WalletsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Create a card' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiCreatedResponse({ description: 'Successful create a card' })
  async createCard(@Body() card: CreateCardDto, @Req() req) {
    const userId = req.user._id;

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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Get cards' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Retrive all user cards' })
  async getCards(@Req() req) {
    const userId = req.user._id;

    // todo: if admin query all cards

    return this.cardsService.getByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Get a card by id' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Retrive a card by id' })
  async getCard(@Param() params: MongoIdValidation, @Req() req) {
    const userId = req.user._id;

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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Delete a card' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Successful delete a card' })
  async deleteCard(@Param() params: MongoIdValidation, @Req() req) {
    const userId = req.user._id;

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
