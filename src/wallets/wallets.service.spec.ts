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
      return {
        populate() {
          return docs.filter(doc => doc.user === search.user);
        },
      };
    },
    findById(id) {
      return {
        populate() {
          return docs.filter(doc => doc.id === id)[0];
        },
      };
    },
    findByIdAndUpdate(walletId, update) {
      if (update.$push) {
        const cards = [];
        cards.push(update.$push.cards);
        return {
          id: walletId,
          cards,
        };
      } else if (update.$pull) {
        return {
          id: walletId,
          cards: [],
        };
      }
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

  it('should create an wallet', async () => {
    const userId = '5cc4e3c80ca02c63b824dd88';
    const createdWallet = await service.create(userId);
    expect(createdWallet.user).toEqual(userId);
  });

  it('should get an wallet by id', async () => {
    const walletId = '5cc5375035cade6de3e47107';
    const userId = '5cc4e3c80ca02c63b824dd88';
    const wallet = await service.getById(walletId);
    expect(wallet.id).toEqual(walletId);
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

  it('should add card in wallet', async () => {
    const walletId = '5cc5375035cade6de3e47107';
    const cardId = '5cc5375035cade6de3e47110';
    await service.addCard(walletId, cardId).then(doc => {
      expect(doc).toEqual({
        id: '5cc5375035cade6de3e47107',
        cards: ['5cc5375035cade6de3e47110'],
      });
    });
  });

  it('should remove card in wallet', async () => {
    const walletId = '5cc5375035cade6de3e47107';
    const cardId = '5cc5375035cade6de3e47110';
    await service.deleteCard(walletId, cardId).then(doc => {
      expect(doc).toEqual({
        id: '5cc5375035cade6de3e47107',
        cards: [],
      });
    });
  });
});
