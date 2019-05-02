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

  async makeATransaction(
    walletId: string,
    userId: string,
    description: string,
    totalAmount: number,
    cards: [any],
  ): Promise<Transaction> {
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

  async findByUserId(userId: string) {
    return await this.transactionModel
      .find({ user: userId })
      .sort({ createdAt: 1 });
  }

  async findById(id: string) {
    return await this.transactionModel.findById(id);
  }

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
