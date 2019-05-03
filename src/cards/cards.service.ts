import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardInterface as Card } from './interfaces/card.interface';

@Injectable()
export class CardsService {
  constructor(@InjectModel('Card') private readonly cardModel: Model<Card>) {}

  async create(card, walletId, userId) {
    try {
      return await this.cardModel.create({
        ...card,
        user: userId,
        wallet: walletId,
        expirationDate: new Date(
          card.expiration.year,
          card.expiration.month + 1,
        ),
        limits: {
          total: card.totalLimit,
          remaining: card.totalLimit,
        },
      });
    } catch (e) {
      if (e.message.includes('E11000')) {
        throw new BadRequestException('Card already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async delete(cardId: string) {
    return await this.cardModel.findByIdAndRemove(cardId);
  }

  async findById(cardId: string) {
    return await this.cardModel.findById(cardId);
  }

  async getByUserId(userId: string) {
    return await this.cardModel.find({ user: userId });
  }

  async index() {
    return await this.cardModel.find();
  }

  async getBestCards(walletId: string, date: any): Promise<[Card]> {
    const cards = await this.cardModel
      .find({
        wallet: walletId,
        expirationDate: { $gte: date.toISOString() },
      })
      // tslint:disable-next-line
      .sort({ closingDay: 1, 'limits.total': 1 });

    if (cards.length === 0) {
      throw new BadRequestException(
        'You do not have eligible cards for this transaction.',
      );
    }

    return cards
      .map(card => {
        const closeDate = moment(
          `${card._doc.closingDay}-${
            card._doc.closingDay < date.date()
              ? date.month() + 1 + 1
              : date.month() + 1
          }`,
          'DD-MM',
        );
        return {
          ...card,
          remainingDaysForClose: closeDate.diff(date, 'days'),
        };
      })
      .sort((a, b) => a.remainingDaysForClose < b.remainingDaysForClose);
  }

  async updateLimits(id: string, data: { used: number; remaining: number }) {
    return await this.cardModel.findByIdAndUpdate(id, {
      'limits.used': data.used,
      'limits.remaining': data.remaining,
    });
  }
}
