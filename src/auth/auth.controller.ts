import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { ApiUseTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ title: 'Authenticate a user' })
  @ApiUnauthorizedResponse({ description: 'Invalid user and/or password' })
  @ApiForbiddenResponse({ description: 'Invalid user and/or password' })
  @ApiOkResponse({ description: 'Sucessfull created auth token '})
  async createToken(@Body() data: SignInDto): Promise<any> {
    return await this.authService.createToken(data);
  }
}
