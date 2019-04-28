import { Model } from 'mongoose';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletInterface as Wallet } from './interface/wallet.interface';
import { CreateCardDto } from './dto/createCard.dto';

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
    return await this.walletModel.find({ user: userId });
  }

  async getById(walletId: string, userId: string) {
    const wallet = await this.walletModel.findById(walletId);

    // todo: check if user is owner of wallet our admin user
    if (wallet.user.toString() === userId) {
      return wallet;
    } else {
      throw new UnauthorizedException();
    }
  }

  async addCard(userId: string, walletId: string, card: CreateCardDto) {
    const wallet = await this.walletModel.findById(walletId);

    // todo: check if user is owner of wallet our admin user
    if (wallet.user.toString() === userId) {
      wallet.cards.push(card);

      return await wallet.save();
    } else {
      throw new UnauthorizedException();
    }
  }

  async deleteCard(userId: string, walletId: string, cardId: string) {
    const wallet = await this.walletModel.findById(walletId);

    // todo: check if user is owner of wallet our admin user
    if (wallet.user.toString() === userId) {
      const validCard = await this.walletModel.findOne({ _id: walletId, cards: { $elemMatch: { _id: cardId }}});

      if (!validCard) { throw new NotFoundException(); }

      await wallet.updateOne({ $pull: { cards: { _id: cardId }}});

      return {
        message: 'Successful deleted',
        statusCode: 200,
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
