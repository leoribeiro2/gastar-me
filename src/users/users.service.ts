import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserInterface as User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(user) {
    try {
      const createdUser = await this.userModel.create(user);
      createdUser.password = undefined;
      return createdUser;
    } catch (e) {
      if (e.message.includes('E11000')) {
        throw new BadRequestException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async index() {
    return this.userModel.find();
  }

  async get(userId: string) {
    return this.userModel.findById(userId);
  }

  async findByEmail(email: string) {
    return await this.userModel
      .findOne({ email })
      .select('password name email role');
  }
}
