import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { CardsService } from '../cards/cards.service';
import { WalletsService } from '../wallets/wallets.service';

describe('Transactions Controller', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let cardsService: CardsService;
  let walletsService: WalletsService;

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
