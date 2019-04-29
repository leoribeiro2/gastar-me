import { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletInterface as Wallet } from './interfaces/wallet.interface';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel('Wallet') private readonly walletModel: Model<Wallet>,
  ) {}

  async create(userId: string) {
    return await this.walletModel.create({
      user: userId,
    });
  }

  async getByUserId(userId: string) {
    return await this.walletModel
      .find({ user: userId })
      .populate({ path: 'cards', populate: { path: 'cards' } });
  }

  async getById(walletId: string) {
    return await this.walletModel
      .findById(walletId)
      .populate({ path: 'cards', populate: { path: 'cards' } });
  }

  async addCard(walletId: string, cardId: string) {
    return await this.walletModel.findByIdAndUpdate(walletId, {
      $push: { cards: cardId },
    });
  }

  async deleteCard(walletId: string, cardId: string) {
    return await this.walletModel.findByIdAndUpdate(walletId, {
      $pull: { cards: cardId },
    });
  }
}
