import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}

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

  @ApiModelProperty({ required: false, enum: ['ADMIN', 'USER'] })
  role?: UserRole;
}
