import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { getModelToken } from '@nestjs/mongoose';
import { WalletsService } from './wallets.service';

describe('Wallets Controller', () => {
  let controller: WalletsController;
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: getModelToken('Wallet'),
          useValue: {},
        },
        WalletsService,
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    service = module.get<WalletsService>(WalletsService);
  });

  it('should create an wallet', async () => {
    const result = {
      id: '5cc5375035cade6de3e47107',
      user: '5cc4f2424cd7977d263fc2c0',
    };

    // @ts-ignore
    jest.spyOn(service, 'create').mockImplementation(() => result);
    expect(await controller.create()).toEqual(result);
  });

  it('should get all wallets', async () => {
    const result = [
      {
        id: '5cc5375035cade6de3e47107',
        user: '5cc4f2424cd7977d263fc2c0',
      },
    ];

    // @ts-ignore
    jest.spyOn(service, 'getByUserId').mockImplementation(() => result);
    expect(await controller.getWallets()).toEqual(result);
  });

  it('should get an wallet by id', async () => {
    const result = {
      id: '5cc5375035cade6de3e47107',
      user: '5cc4f2424cd7977d263fc2c0',
    };

    // @ts-ignore
    jest.spyOn(service, 'getById').mockImplementation(() => result);
    expect(await controller.getWalletById('5cc5375035cade6de3e47107')).toEqual(result);
  });
});
