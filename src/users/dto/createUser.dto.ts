import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiModelProperty({ required: true, minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
