import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTransactionDTO {
  @IsNotEmpty()
  @IsMongoId()
  wallet: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  amount: number;
}
