import { CardInterface } from './card.interface';

export interface WalletInterface {
  id: string;
  user: string;
  totalLimit: number;
  remainingLimit: number;
}
