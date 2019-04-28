import { IsNotEmpty } from 'class-validator';

export class ExpirationDto {
  @IsNotEmpty()
  month: number;

  @IsNotEmpty()
  year: number;
}
