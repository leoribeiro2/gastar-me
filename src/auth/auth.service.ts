import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './intefaces/jwt-payload.interface';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createToken(data) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid user and/or password');
    }

    const isValid = await user.validatePass(data.password);
    if (!isValid) {
      throw new ForbiddenException('Invalid user and/or password');
    }

    const token = this.jwtService.sign({ email: user.email });
    await user.save();
    user.password = undefined;

    return {
      token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return this.usersService.findByEmail(payload.email);
  }
}
