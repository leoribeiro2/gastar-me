import { WalletInterface } from '../../wallets/interfaces/wallet.interface';
import { CardInterface } from '../../cards/interfaces/card.interface';
import { UserInterface } from '../../users/interfaces/user.interface';

interface CardsTrasactionInterface {
  card: string;
  amount: number;
}

export interface TransactionInterface {
  _id: string;
  wallet: WalletInterface;
  cards: [CardsTrasactionInterface];
  user: UserInterface;
  description: string;
  totalAmount: number;
  paid: boolean;
}
