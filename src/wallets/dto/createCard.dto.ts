import { ExpirationDto } from './expiration.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  cardHolderName: string;

  @IsNotEmpty()
  cvv: number;

  @IsNotEmpty()
  expiration: ExpirationDto;

  @IsNotEmpty()
  creditLimit: number;

  @IsNotEmpty()
  closingDay: number;
}
