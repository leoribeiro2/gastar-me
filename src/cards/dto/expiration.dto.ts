import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ExpirationDto {
  @ApiModelProperty({ required: true, maxLength: 2 })
  @IsNotEmpty()
  @MaxLength(2)
  month: number;

  @ApiModelProperty({ required: true, maxLength: 4, minLength: 4 })
  @IsNotEmpty()
  @MaxLength(4)
  @MinLength(4)
  year: number;
}
