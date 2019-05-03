import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { getModelToken } from '@nestjs/mongoose';
import { WalletsService } from './wallets.service';
import { MongoIdValidation } from '../helpers/mongoIdValidation';

describe('Wallets Controller', () => {
  let controller: WalletsController;
  let walletsService: WalletsService;

  const req = {
    user: {
      _id: '5cc4f2424cd7977d263fc2c0',
    },
  };

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
    walletsService = module.get<WalletsService>(WalletsService);
  });

  describe('Create wallet', () => {
    it('should create an wallet', async () => {
      const result = {
        id: '5cc5375035cade6de3e47107',
        user: '5cc4f2424cd7977d263fc2c0',
      };

      // @ts-ignore
      jest.spyOn(walletsService, 'create').mockImplementation(() => result);
      expect(await controller.create(req)).toEqual(result);
    });
  });

  describe('Get wallets', () => {
    it('should get all wallets', async () => {
      const result = [
        {
          id: '5cc5375035cade6de3e47107',
          user: '5cc4f2424cd7977d263fc2c0',
        },
      ];

      jest
        .spyOn(walletsService, 'getByUserId')
        // @ts-ignore
        .mockImplementation(() => result);
      expect(await controller.getWallets(req)).toEqual(result);
    });
  });

  describe('Get wallet by id', () => {
    it('should get an wallet by id', async () => {
      const result = {
        id: '5cc5375035cade6de3e47107',
        user: '5cc4f2424cd7977d263fc2c0',
      };

      const params: MongoIdValidation = {
        id: '5cc5375035cade6de3e47107',
      };

      // @ts-ignore
      jest.spyOn(walletsService, 'getById').mockImplementation(() => result);
      expect(await controller.getWalletById(params, req)).toEqual(result);
    });

    it('should not found error if the wallet does not exist', async () => {
      const result = null;

      const params: MongoIdValidation = {
        id: '5cc5375035cade6de3e47107',
      };

      jest.spyOn(walletsService, 'getById').mockImplementation(() => result);
      await controller.getWalletById(params, req).catch(e => {
        expect(e.response).toEqual({ statusCode: 404, error: 'Not Found' });
      });
    });

    it('should unauthorized error if user not owner of wallet', async () => {
      const result = {
        id: '5cc5375035cade6de3e47107',
        user: '5cc4f2424cd7977d263fc2c7',
      };

      const params: MongoIdValidation = {
        id: '5cc5375035cade6de3e47107',
      };

      // @ts-ignore
      jest.spyOn(walletsService, 'getById').mockImplementation(() => result);
      await controller.getWalletById(params, req).catch(e => {
        expect(e.response).toEqual({ statusCode: 401, error: 'Unauthorized' });
      });
    });
  });
});
