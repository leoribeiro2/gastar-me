import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  password: string;
}
