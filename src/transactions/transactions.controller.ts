import {
  Controller,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
  Get,
  Param,
  UnauthorizedException,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dto/createTransaction.dto';
import { WalletsService } from '../wallets/wallets.service';
import { CardsService } from '../cards/cards.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import * as moment from 'moment';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    private readonly cardsService: CardsService,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionDTO) {
    const userId = '5cc4f2424cd7977d263fc2c0';

    const wallet = await this.walletsService.getById(body.wallet);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.limits.remaining < body.amount) {
      throw new BadRequestException(
        'You do not have enough limit released for this transaction.',
      );
    }

    const cards = await this.cardsService.getBestCards(wallet.id, moment());
    return await this.transactionsService.makeATransaction(
      wallet.id,
      userId,
      body.description,
      body.amount,
      cards,
    );
  }

  @Get()
  async getTransactions() {
    const userId = '5cc4f2424cd7977d263fc2c0';

    return await this.transactionsService.findByUserId(userId);
  }

  @Get('/:id')
  async getTransaction(@Param() params: MongoIdValidation) {
    const userId = '5cc4f2424cd7977d263fc2c0';

    const transaction = await this.transactionsService.findById(params.id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // todo: change to req user
    if (transaction.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    return transaction;
  }

  @Put('/:id')
  async payTransaction(@Param() params: MongoIdValidation) {
    const userId = '5cc4f2424cd7977d263fc2c0';

    const transaction = await this.transactionsService.findById(params.id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // todo: change to req user
    if (transaction.user.toString() !== userId) {
      throw new UnauthorizedException();
    }

    await this.transactionsService.payTransaction(transaction._doc);

    return {
      statusCode: 200,
      message: 'Transaction successfully paid',
    };
  }
}
