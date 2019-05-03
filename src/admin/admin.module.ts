import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { WalletsService } from './../wallets/wallets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './../wallets/schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }]),
  ],
  controllers: [AdminController],
  providers: [WalletsService],
})
export class AdminModule {}
