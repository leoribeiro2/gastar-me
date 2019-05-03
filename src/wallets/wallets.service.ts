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
    const wallets = await this.walletModel
      .find({ user: userId })
      .populate({ path: 'cards', populate: { path: 'cards' } });

    return await wallets.map(wallet => {
      const limits: number = wallet._doc.cards.reduce((a, b) => ({
        total: a.limits.total + b.limits.total,
        used: a.limits.used + b.limits.used,
        remaining: a.limits.remaining + b.limits.remaining,
      }));
      return {
        ...wallet._doc,
        limits,
      };
    });
  }

  async getById(walletId: string) {
    const wallet = await this.walletModel
      .findById(walletId)
      .populate({ path: 'cards', populate: { path: 'cards' } });

    const limits: number = wallet._doc.cards.reduce((a, b) => ({
      total: a.limits.total + b.limits.total,
      used: a.limits.used + b.limits.used,
      remaining: a.limits.remaining + b.limits.remaining,
    }));

    return {
      ...wallet._doc,
      limits,
    };
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

  async index() {
    return await this.walletModel.find();
  }

  async deleteWallet(id: string) {
    return this.walletModel.findByIdAndDelete(id);
  }
}
