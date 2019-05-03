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

  /**
   * Create a user on database
   * @param user user data
   */
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

  /**
   * Get all users
   */
  async index() {
    return this.userModel.find();
  }

  /**
   * Get a user by id
   * @param userId User Id
   */
  async get(userId: string) {
    return this.userModel.findById(userId);
  }

  /**
   * Get user by email
   * @param email user email
   */
  async findByEmail(email: string) {
    return await this.userModel
      .findOne({ email })
      .select('password name email role');
  }
}
