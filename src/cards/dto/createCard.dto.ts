import { ExpirationDto } from './expiration.dto';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @IsNotEmpty()
  @IsMongoId()
  wallet: string;

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
  totalLimit: number;

  @IsNotEmpty()
  closingDay: number;
}
