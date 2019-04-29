import { CardInterface } from '../../cards/interfaces/card.interface';

export interface WalletInterface {
  user: string;
  cards: [CardInterface];
  totalLimit: number;
  remainingLimit: number;
}
