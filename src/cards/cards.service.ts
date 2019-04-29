import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardInterface as Card } from './interfaces/card.interface';

@Injectable()
export class CardsService {
  constructor(@InjectModel('Card') private readonly cardModel: Model<Card>) {}

  async create(card, walletId, userId) {
    const cardCreated = card;
    cardCreated.wallet = walletId;
    cardCreated.user = userId;
    try {
      return await this.cardModel.create(cardCreated);
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
}
