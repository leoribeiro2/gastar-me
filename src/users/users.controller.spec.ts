import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { getModelToken } from '@nestjs/mongoose';

describe('Users Controller', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: getModelToken('User'),
          useValue: {},
        },
        UsersService,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  it('should create an user', async () => {
    const user: CreateUserDto = {
      name: 'Foo',
      email: 'foo@test.com',
      password: 'secret',
    };
    const result = {
      role: 'USER',
      _id: '5cc4e3c80ca02c63b824dd88',
      name: user.name,
      email: user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    // @ts-ignore
    jest.spyOn(usersService, 'create').mockImplementation(() => result);
    expect(await usersController.signUp(user));
  });

  it('should get user by id', async () => {
    const result = {
      role: 'USER',
      _id: '5cc4e3c80ca02c63b824dd88',
      name: 'Foo',
      email: 'foo@test.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    // @ts-ignore
    jest.spyOn(usersService, 'get').mockImplementation(() => result);
    expect(await usersController.getUser('5cc4e3c80ca02c63b824dd88')).toEqual(
      result,
    );
  });

  it('should receive an error when the user does not exist', () => {
    jest.spyOn(usersService, 'get').mockImplementation(() => null);
    usersController.getUser('5cc4e3c80ca02c63b824dd66').catch(e => {
      expect(e.responses === { statusCode: 404, error: 'Not Found' });
    });
  });

  it('should get all users', async () => {
    const result = [
      {
        role: 'USER',
        _id: '5cc4e3c80ca02c63b824dd88',
        name: 'Josh',
        email: 'josh@test.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
      {
        role: 'USER',
        _id: '5cc4e3c80ca02c63b824dd99',
        name: 'Foo',
        email: 'foo@test.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
    ];

    // @ts-ignore
    jest.spyOn(usersService, 'index').mockImplementation(() => result);
    expect(await usersController.listUsers()).toEqual(result);
  });
});
