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
      const remaining: number = wallet._doc.cards.reduce(
        (a, b) => a.limits.remaining + b.limits.remaining,
      );
      const total: number = wallet._doc.cards.reduce(
        (a, b) => a.limits.total + b.limits.total,
      );
      const used: number = wallet._doc.cards.reduce(
        (a, b) => a.limits.used + b.limits.used,
      );
      return {
        ...wallet._doc,
        limits: {
          total,
          used,
          remaining,
        },
      };
    });
  }

  async getById(walletId: string) {
    const wallet = await this.walletModel
      .findById(walletId)
      .populate({ path: 'cards', populate: { path: 'cards' } });

    const remaining: number = wallet._doc.cards.reduce(
      (a, b) => a.limits.remaining + b.limits.remaining,
    );
    const total: number = wallet._doc.cards.reduce(
      (a, b) => a.limits.total + b.limits.total,
    );
    const used: number = wallet._doc.cards.reduce(
      (a, b) => a.limits.used + b.limits.used,
    );
    return {
      ...wallet._doc,
      limits: {
        total,
        used,
        remaining,
      },
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
}
