import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { CardsService } from '../cards/cards.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateTransactionDTO } from './dto/createTransaction.dto';
import { MongoIdValidation } from './../helpers/mongoIdValidation';

describe('Transactions Controller', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let cardsService: CardsService;
  let walletsService: WalletsService;

  const req = {
    user: {
      _id: '5cc4f2424cd7977d263fc2c0',
    },
  };

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

  const mockWallet = {
    id: '5cc5375035cade6de3e47107',
    user: '5cc4f2424cd7977d263fc2c0',
    cards: [
      {
        limits: {
          remaining: 3000,
          total: 6000,
          used: 3000,
        },
      },
      {
        limits: {
          remaining: 2000,
          total: 4000,
          used: 2000,
        },
      },
    ],
    limits: {
      remaining: 5000,
    },
  };

  const mockMakeTransaction: any = {
    id: '5cca2664e88b914d3c23caa7',
    user: '5cc4f2424cd7977d263fc2c0',
    wallet: mockWallet.id,
    description: 'test transaction',
    totalAmount: 1000,
    cards: [mockCards[0]],
  };

  const mockTransactions: any = [
    {
      id: '5cca2664e88b914d3c23caa7',
      user: '5cc4f2424cd7977d263fc2c0',
      wallet: mockWallet.id,
      description: 'test transaction',
      totalAmount: 1000,
      cards: [mockCards[0]],
    },
    {
      id: '5cca2664e88b914d3c23caa8',
      user: '5cc4f2424cd7977d263fc2c0',
      wallet: mockWallet.id,
      description: 'test transaction',
      totalAmount: 1000,
      cards: [mockCards[0]],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('Transaction'),
          useValue: {},
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
      controllers: [TransactionsController],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    cardsService = module.get<CardsService>(CardsService);
    walletsService = module.get<WalletsService>(WalletsService);
    controller = module.get<TransactionsController>(TransactionsController);
  });

  describe('Create', () => {
    it('should create an trasaction', async () => {
      const body: CreateTransactionDTO = {
        wallet: '5cc60505d3f5e97094381fd4',
        description: 'test transaction',
        amount: 1000,
      };

      jest
        .spyOn(walletsService, 'getById')
        .mockImplementation(async () => mockWallet);
      jest
        .spyOn(cardsService, 'getBestCards')
        .mockImplementation(async () => mockCards);
      jest
        .spyOn(service, 'makeATransaction')
        .mockImplementation(async () => mockMakeTransaction);

      await controller.create(body, req).then(transaction => {
        expect(transaction.user).toEqual('5cc4f2424cd7977d263fc2c0');
        expect(transaction.totalAmount).toEqual(1000);
      });
    });

    it('should receive not found error if wallet not exists', async () => {
      const body: CreateTransactionDTO = {
        wallet: '5cc60505d3f5e97094381fd4',
        description: 'test transaction',
        amount: 1000,
      };

      jest
        .spyOn(walletsService, 'getById')
        .mockImplementation(async () => null);

      await controller.create(body, req).catch(e => {
        expect(e.response).toEqual({
          error: 'Not Found',
          message: 'Wallet not found',
          statusCode: 404,
        });
      });
    });

    it('should receive bad request error if not have limit for transaction', async () => {
      const body: CreateTransactionDTO = {
        wallet: '5cc60505d3f5e97094381fd4',
        description: 'test transaction',
        amount: 100000,
      };

      jest
        .spyOn(walletsService, 'getById')
        .mockImplementation(async () => mockWallet);

      await controller.create(body, req).catch(e => {
        expect(e.response).toEqual({
          error: 'Bad Request',
          message:
            'You do not have enough limit released for this transaction.',
          statusCode: 400,
        });
      });
    });
  });

  describe('Get Transactions', () => {
    it('should get transactions by user id', async () => {
      jest
        .spyOn(service, 'findByUserId')
        .mockImplementation(async () => mockTransactions);

      await controller.getTransactions(req).then(transactions => {
        expect(transactions).toEqual(mockTransactions);
        expect(service.findByUserId).toBeCalled();
      });
    });
  });

  describe('Get Transaction', () => {
    it('should get transaction by id', async () => {
      const params: MongoIdValidation = {
        id: '5cca2664e88b914d3c23caa7',
      };

      jest
        .spyOn(service, 'findById')
        .mockImplementation(async () => mockTransactions[0]);

      await controller.getTransaction(params, req).then(transaction => {
        expect(transaction).toEqual(mockTransactions[0]);
        expect(service.findById).toBeCalled();
      });
    });

    it('should receive not found error if transaction not exists', async () => {
      const params: MongoIdValidation = {
        id: '5cca2664e88b914d3c23caa7',
      };

      jest.spyOn(service, 'findById').mockImplementation(async () => null);

      await controller.getTransaction(params, req).catch(e => {
        expect(e.response).toEqual({
          error: 'Not Found',
          message: 'Transaction not found',
          statusCode: 404,
        });
      });
    });

    it('should receive unauthorized error if user is not transaction owner', async () => {
      const params: MongoIdValidation = {
        id: '5cca2664e88b914d3c23caa7',
      };

      const mock = mockTransactions[0];
      mock.user = '5cc4f2424cd7977d263fc2c1';

      jest.spyOn(service, 'findById').mockImplementation(async () => mock);

      await controller.getTransaction(params, req).catch(e => {
        expect(e.response).toEqual({
          error: 'Unauthorized',
          statusCode: 401,
        });
      });
    });
  });

  describe('Pay Transaction', () => {
    it('should pay transaction', async () => {
      const params: MongoIdValidation = {
        id: '5cca2664e88b914d3c23caa7',
      };

      jest
        .spyOn(service, 'findById')
        .mockImplementation(async () => mockTransactions[1]);
      jest
        .spyOn(service, 'payTransaction')
        .mockImplementation(async () => true);

      await controller.payTransaction(params, req).then(res => {
        expect(res).toEqual({
          statusCode: 200,
          message: 'Transaction successfully paid',
        });
        expect(service.findById).toBeCalled();
        expect(service.payTransaction).toBeCalled();
      });
    });

    it('should receive not found error if transaction not exists', async () => {
      const params: MongoIdValidation = {
        id: '5cca2664e88b914d3c23caa7',
      };

      jest.spyOn(service, 'findById').mockImplementation(async () => null);

      await controller.payTransaction(params, req).catch(e => {
        expect(e.response).toEqual({
          error: 'Not Found',
          message: 'Transaction not found',
          statusCode: 404,
        });
      });
    });

    it('should receive unauthorized error if user is not transaction owner', async () => {
      const params: MongoIdValidation = {
        id: '5cca2664e88b914d3c23caa7',
      };

      jest
        .spyOn(service, 'findById')
        .mockImplementation(async () => mockTransactions[0]);

      await controller.payTransaction(params, req).catch(e => {
        expect(e.response).toEqual({
          error: 'Unauthorized',
          statusCode: 401,
        });
      });
    });
  });
});
