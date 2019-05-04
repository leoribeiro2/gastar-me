import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionInterface as Transaction } from './interfaces/transaction.interface';
import { CardsService } from '../cards/cards.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly cardsService: CardsService,
  ) {}

  /**
   * Make a transaction using one or more cards
   * @param walletId wallet id
   * @param userId user id
   * @param description transaction description
   * @param totalAmount total amount of trasaction
   * @param cards list of best cards
   */
  async makeATransaction(
    walletId: string,
    userId: string,
    description: string,
    totalAmount: number,
    cards: [any],
  ): Promise<Transaction> {
    // todo: refactor to rxjs

    const usedCards = [];
    let amount: number = totalAmount;
    for (const card of cards) {
      const isComplete: boolean = amount < card.limits.remaining;

      let transactionAmount: number;
      if (isComplete) {
        transactionAmount = amount;
      } else {
        transactionAmount = card.limits.remaining;
        amount = amount - transactionAmount;
      }

      await this.cardsService.updateLimits(card._id, {
        used: card.limits.used + transactionAmount,
        remaining: card.limits.remaining - transactionAmount,
      });

      usedCards.push({
        card: card._id,
        amount: transactionAmount,
      });

      if (isComplete) {
        break;
      }
    }

    return await this.transactionModel.create({
      wallet: walletId,
      cards: usedCards,
      user: userId,
      description,
      totalAmount,
    });
  }

  /**
   * Get transactions by user id
   * @param userId user id
   */
  async findByUserId(userId: string) {
    return await this.transactionModel
      .find({ user: userId })
      .sort({ createdAt: 1 });
  }

  /**
   * Get transaction by id
   * @param id transaction id
   */
  async findById(id: string) {
    return await this.transactionModel.findById(id);
  }

  /**
   * Pay a transaction
   * @param transaction Transaction data
   */
  async payTransaction(transaction: Transaction) {
    for (const card of transaction.cards) {
      const oldCard = await this.cardsService.findById(card.card);

      await this.cardsService.updateLimits(card.card, {
        used: oldCard.limits.used - card.amount,
        remaining: oldCard.limits.remaining - card.amount,
      });
    }

    return await this.transactionModel.findByIdAndUpdate(transaction._id, {
      paid: true,
    });
  }
}
