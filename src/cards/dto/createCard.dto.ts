import { ExpirationDto } from './expiration.dto';
import {
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
  Max,
  Min,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @IsMongoId()
  wallet: string;

  @ApiModelProperty({ required: true, maxLength: 16, minLength: 15 })
  @IsNotEmpty()
  @MaxLength(16)
  @MinLength(15)
  @IsNumber()
  number: string;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  cardHolderName: string;

  @ApiModelProperty({ required: true, maxLength: 3 })
  @IsNotEmpty()
  @MaxLength(3)
  cvv: number;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @Type(() => ExpirationDto)
  @ValidateNested({ each: true })
  expiration: ExpirationDto;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  totalLimit: number;

  @ApiModelProperty({ required: true, maximum: 31 })
  @IsNotEmpty()
  @Max(31)
  closingDay: number;
}
