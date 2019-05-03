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
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dto/createTransaction.dto';
import { WalletsService } from '../wallets/wallets.service';
import { CardsService } from '../cards/cards.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';
import * as moment from 'moment';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiImplicitParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletsService: WalletsService,
    private readonly cardsService: CardsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Create a transaction' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiCreatedResponse({ description: 'Successful create a transaction' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateTransactionDTO, @Req() req) {
    const userId = req.user._id;

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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Get trasactions' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiOkResponse({ description: 'Retrive all user transactions' })
  async getTransactions(@Req() req) {
    const userId = req.user._id;

    return await this.transactionsService.findByUserId(userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Get a transaction by id' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiOkResponse({ description: 'Retrive transaction by id' })
  @ApiImplicitParam({ name: 'id', description: 'Transaction id' })
  async getTransaction(@Param() params: MongoIdValidation, @Req() req) {
    const userId = req.user._id;

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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ title: 'Pay a transaction' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiOkResponse({ description: 'Successful pay a transaction' })
  @ApiImplicitParam({ name: 'id', description: 'Transaction id' })
  async payTransaction(@Param() params: MongoIdValidation, @Req() req) {
    const userId = req.user._id;

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
