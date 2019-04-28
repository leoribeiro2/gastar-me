import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { getModelToken } from '@nestjs/mongoose';

describe('WalletsService', () => {
  let service: WalletsService;

  const docs = [];

  const repoMock = {
    create(wallet) {
      const doc = {
        id: '5cc5375035cade6de3e47107',
        user: wallet.user,
      };
      docs.push(doc);
      return docs[0];
    },
    find(search) {
      return docs.filter(doc => doc.user === search.user);
    },
    findById(id) {
      return docs.filter((doc) => doc.id === id)[0];
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: getModelToken('Wallet'),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
  });

  describe('Create wallet', () => {
    it('should create an wallet', async () => {
      const userId = '5cc4e3c80ca02c63b824dd88';
      const createdWallet = await service.create(userId);
      expect(createdWallet.user).toEqual(userId);
    });
  });

  describe('Get wallet', () => {
    it('should get an wallet by id', async () => {
      const walletId = '5cc5375035cade6de3e47107';
      const userId = '5cc4e3c80ca02c63b824dd88';
      const wallet = await service.getById(walletId, userId);
      expect(wallet.id).toEqual(walletId);
      expect(wallet.user).toEqual(userId);
    });

    it('should receive unauthorized error if user is not the owner of the wallet', () => {
      const walletId = '5cc5375035cade6de3e47107';
      const userId = '5cc4e3c80ca02c63b824dd99';
      service.getById(walletId, userId).catch(e => {
        expect(e.response).toEqual({ statusCode: 401, error: 'Unauthorized' });
      });
    });

    it('should get wallets by user id', async () => {
      const userId = '5cc4e3c80ca02c63b824dd88';
      const wallets = await service.getByUserId(userId);
      expect(wallets).toEqual([
        {
          id: '5cc5375035cade6de3e47107',
          user: '5cc4e3c80ca02c63b824dd88',
        },
      ]);
    });
  });
});
