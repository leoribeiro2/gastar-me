import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const repoMock = {
      create: (user) => {
        if (user.email === 'test1@test.com') {
          throw new Error('E11000');
        }

        if (!user.email) {
          throw new Error('Mongo error');
        }

        return {
          role: user.role,
          _id: '5cc4e3c80ca02c63b824dd88',
          name: user.name,
          email: user.email,
          __v: 0,
        };
      },
      find: () => [
        {
          role: 'USER',
          _id: '5cc4e3c80ca02c63b824dd88',
          name: 'User Example 1',
          email: 'test1@test.com',
          __v: 0,
        },
        {
          role: 'ADMIN',
          _id: '5cc4e8fa3242066cf7c21391',
          name: 'User Example 2',
          email: 'test2@test.com',
          __v: 0,
        },
      ],
      findById: (id) => ({
        _id: id,
        role: 'USER',
        name: 'User Example 1',
        email: 'test1@test.com',
        __v: 0,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('Create user', () => {
    it('should create an user',  async () => {
      const createdUser = await service.create({
        name: 'Josh',
        email: 'josh@mail.com',
        password: 'foo',
      });
      expect(createdUser.name).toEqual('Josh');
      expect(createdUser.email).toEqual('josh@mail.com');
    });

    it('should receive an error while registering an existing user', () => {
      const user = {
        name: 'User Example 1',
        email: 'test1@test.com',
        password: 'secret',
      };
      service.create(user).catch(e => {
        expect(e.response).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'User already exists',
        });
      });
    });

    it('should receive an error if an error occurs in mongoDB', () => {
      const user = {
        name: 'User Example 1',
        password: 'secret',
      };
      service.create(user).catch(e => {
        expect(e.response).toEqual({
          statusCode: 500,
          error: 'Internal Server Error',
        });
      });
    });
  });

  describe('Get users', () => {
    it('should get all users', async () => {
      const expected = [
        {
          role: 'USER',
          _id: '5cc4e3c80ca02c63b824dd88',
          name: 'User Example 1',
          email: 'test1@test.com',
          __v: 0,
        },
        {
          role: 'ADMIN',
          _id: '5cc4e8fa3242066cf7c21391',
          name: 'User Example 2',
          email: 'test2@test.com',
          __v: 0,
        },
      ];
      const users = await service.index();
      expect(users).toEqual(expected);
    });
  });

  it('should get user by id', async () => {
    const expected = {
      role: 'USER',
      _id: '5cc4e3c80ca02c63b824dd88',
      name: 'User Example 1',
      email: 'test1@test.com',
      __v: 0,
    };

    expect(await service.get(expected._id)).toEqual(expected);
  });
});
