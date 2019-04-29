import { ExpirationDto } from './expiration.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  cardHolderName: string;

  @IsNotEmpty()
  cvv: number;

  @IsNotEmpty()
  @Type(() => ExpirationDto)
  @ValidateNested({ each: true })
  expiration: ExpirationDto;

  @IsNotEmpty()
  creditLimit: number;

  @IsNotEmpty()
  closingDay: number;
}
