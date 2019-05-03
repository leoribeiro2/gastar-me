import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateTransactionDTO {
  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @IsMongoId()
  wallet: string;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  description: string;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  amount: number;
}
