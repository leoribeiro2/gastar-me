import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardSchema } from './schemas/card.schema';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { WalletSchema } from '../wallets/schemas/wallet.schema';
import { WalletsService } from '../wallets/wallets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Card', schema: CardSchema },
      { name: 'Wallet', schema: WalletSchema },
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService, WalletsService],
})
export class CardsModule {}
