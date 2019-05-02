import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { WalletsService } from '../wallets/wallets.service';
import { WalletSchema } from '../wallets/schemas/wallet.schema';
import { CardsService } from '../cards/cards.service';
import { CardSchema } from '../cards/schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Wallet', schema: WalletSchema },
      { name: 'Card', schema: CardSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, WalletsService, CardsService],
})
export class TransactionsModule {}
