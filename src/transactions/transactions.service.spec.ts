import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { CardsService } from '../cards/cards.service';
import { WalletsService } from '../wallets/wallets.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let cardsService: CardsService;
  let walletsService: WalletsService;

  const mockCards: any = [
    {
      _id: '5cca4836e8a1725fcb66adb2',
      limits: {
        total: 10000,
        used: 2000,
        remaining: 8000,
      },
    },
    {
      _id: '5cca4838e8a1725fcb66adb3',
      limits: {
        total: 2000,
        used: 500,
        remaining: 1500,
      },
    },
    {
      _id: '5cca4838e8a1725fcb66adb4',
      limits: {
        total: 2000,
        used: 500,
        remaining: 1500,
      },
    },
  ];

  const docs = [
    {
      id: '5cca2664e88b914d3c23caa7',
      user: '5cc4f2424cd7977d263fc2c0',
    },
  ];

  const mockRepo = {
    create(transaction) {
      return transaction;
    },
    find(query) {
      return {
        sort() {
          return docs.filter(doc => doc.user === query.user)[0];
        },
      };
    },
    findById(id) {
      return docs.filter(doc => doc.id === id)[0];
    },
    findByIdAndUpdate(id, update) {
      return {
        ...docs[0],
        paid: true,
      };
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('Transaction'),
          useValue: mockRepo,
        },
        {
          provide: getModelToken('Wallet'),
          useValue: {},
        },
        {
          provide: getModelToken('Card'),
          useValue: {},
        },
        TransactionsService,
        CardsService,
        WalletsService,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    cardsService = module.get<CardsService>(CardsService);
    walletsService = module.get<WalletsService>(WalletsService);
  });

  describe('Make A Transaction', () => {
    it('should make a transaction using only one card', async () => {
      const walletId = '5cc60505d3f5e97094381fd4';
      const userId = '5cc4f2424cd7977d263fc2c0';
      const description = 'Test transaction';
      const totalAmount = 5000;

      jest
        .spyOn(cardsService, 'updateLimits')
        .mockImplementation(async () => true);

      await service
        .makeATransaction(walletId, userId, description, totalAmount, mockCards)
        .then(transaction => {
          expect(transaction.wallet).toEqual(walletId);
          expect(transaction.cards).toEqual([
            { card: mockCards[0]._id, amount: totalAmount },
          ]);
          expect(transaction.totalAmount).toEqual(totalAmount);
        });
    });

    it('should make a transaction using two cards', async () => {
      const walletId = '5cc60505d3f5e97094381fd4';
      const userId = '5cc4f2424cd7977d263fc2c0';
      const description = 'Test transaction';
      const totalAmount = 9000;

      jest
        .spyOn(cardsService, 'updateLimits')
        .mockImplementation(async () => true);

      await service
        .makeATransaction(walletId, userId, description, totalAmount, mockCards)
        .then(transaction => {
          expect(transaction.wallet).toEqual(walletId);
          expect(transaction.cards).toEqual([
            { card: mockCards[0]._id, amount: 8000 },
            { card: mockCards[1]._id, amount: 1000 },
          ]);
        });
    });

    it('should make a transaction using three cards', async () => {
      const walletId = '5cc60505d3f5e97094381fd4';
      const userId = '5cc4f2424cd7977d263fc2c0';
      const description = 'Test transaction';
      const totalAmount = 10000;

      jest
        .spyOn(cardsService, 'updateLimits')
        .mockImplementation(async () => true);

      await service
        .makeATransaction(walletId, userId, description, totalAmount, mockCards)
        .then(transaction => {
          expect(transaction.wallet).toEqual(walletId);
          expect(transaction.cards).toEqual([
            { card: mockCards[0]._id, amount: 8000 },
            { card: mockCards[1]._id, amount: 1500 },
            { card: mockCards[2]._id, amount: 500 },
          ]);
        });
    });

    it('should find by user id', async () => {
      const userId = '5cc4f2424cd7977d263fc2c0';

      await service.findByUserId(userId).then(transaction => {
        expect(transaction.user).toEqual(userId);
      });
    });

    it('should find by id', async () => {
      const transactionId = '5cca2664e88b914d3c23caa7';

      await service.findById(transactionId).then(transaction => {
        expect(transaction.id).toEqual(transactionId);
      });
    });

    it('should pay a transaction', async () => {
      const transaction: any = {
        cards: [
          {
            card: '5cca4836e8a1725fcb66adb2',
            amount: 1000,
          },
        ],
        _id: '5cca2664e88b914d3c23caa7',
      };

      jest
        .spyOn(cardsService, 'updateLimits')
        .mockImplementation(async () => true);
      jest
        .spyOn(cardsService, 'findById')
        .mockImplementation(async () => mockCards[0]);

      await service.payTransaction(transaction).then(res => {
        expect(res.id).toEqual('5cca2664e88b914d3c23caa7');
        expect(res.paid).toBeTruthy();
      });
    });
  });
});
