import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WalletsService } from '../wallets/wallets.service';
import { CreateCardDto } from './dto/createCard.dto';
import mock = jest.mock;

describe('Cards Controller', () => {
  const mockCard = {
    expiration: {
      month: 2,
      year: 2026,
    },
    _id: '5cc60519d3f5e97094381fd5',
    number: '233432323457',
    cardHolderName: 'Josh',
    cvv: 232,
    creditLimit: 6675.76,
    closingDay: 24,
    wallet: '5cc60505d3f5e97094381fd4',
    user: '5cc4f2424cd7977d263fc2c0',
  };

  const mockCards = [
    {
      expiration: {
        month: 2,
        year: 2026,
      },
      _id: '5cc60519d3f5e97094381fd5',
      number: '233432323457',
      cardHolderName: 'Josh',
      cvv: 232,
      creditLimit: 6675.76,
      closingDay: 24,
      wallet: '5cc60505d3f5e97094381fd4',
      user: '5cc4f2424cd7977d263fc2c0',
    },
    {
      expiration: {
        month: 2,
        year: 2026,
      },
      _id: '5cc60519d3f5e97094381fd5',
      number: '233432323457',
      cardHolderName: 'Josh',
      cvv: 232,
      creditLimit: 6675.76,
      closingDay: 24,
      wallet: '5cc60505d3f5e97094381fd4',
      user: '5cc4f2424cd7977d263fc2c0',
    },
  ];

  const mockWallet = {
    id: '5cc5375035cade6de3e47107',
    user: '5cc4f2424cd7977d263fc2c0',
  };

  const bodyMock: CreateCardDto = {
    walletId: mockCard.wallet,
    number: mockCard.number,
    cardHolderName: mockCard.cardHolderName,
    cvv: mockCard.cvv,
    expiration: mockCard.expiration,
    creditLimit: mockCard.creditLimit,
    closingDay: mockCard.closingDay,
  };

  let controller: CardsController;
  let cardsService: CardsService;
  let walletsService: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: getModelToken('Card'),
          useValue: {},
        },
        {
          provide: getModelToken('Wallet'),
          useValue: {},
        },
        CardsService,
        WalletsService,
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    cardsService = module.get<CardsService>(CardsService);
    walletsService = module.get<WalletsService>(WalletsService);
  });

  describe('Create Card', () => {
    it('should create a card', async () => {
      jest
        .spyOn(walletsService, 'getById')
        // @ts-ignore
        .mockImplementation(() => mockWallet);
      // @ts-ignore
      jest.spyOn(cardsService, 'create').mockImplementation(() => mockCard);
      jest.spyOn(walletsService, 'addCard').mockImplementation(() => null);

      expect(await controller.createCard(bodyMock)).toEqual(mockCard);
    });

    it('should receive error not found if wallet does not exist', async () => {
      jest.spyOn(walletsService, 'getById').mockImplementation(() => null);
      await controller.createCard(bodyMock).catch(e => {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Wallet not found',
        });
      });
    });

    it('should receive error unauthorized if user not owner of wallet', async () => {
      const result = {
        expiration: {
          month: 2,
          year: 2026,
        },
        _id: '5cc60519d3f5e97094381fd5',
        number: '233432323457',
        cardHolderName: 'Josh',
        cvv: 232,
        creditLimit: 6675.76,
        closingDay: 24,
        wallet: '5cc60505d3f5e97094381fd4',
        user: '5cc4f2424cd7977d263fc2c7',
      };

      // @ts-ignore
      jest.spyOn(walletsService, 'getById').mockImplementation(() => result);
      await controller.createCard(bodyMock).catch(e => {
        expect(e.response).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
        });
      });
    });
  });

  describe('Get Cards', () => {
    it('should get cards', async () => {
      jest
        .spyOn(cardsService, 'getByUserId')
        // @ts-ignore
        .mockImplementation(() => mockCards);
      expect(await controller.getCards()).toEqual(mockCards);
    });
  });

  describe('Get Card', () => {
    it('should get an card by id', async () => {
      // @ts-ignore
      jest.spyOn(cardsService, 'findById').mockImplementation(() => mockCard);
      expect(await controller.getCard('5cc60519d3f5e97094381fd5')).toEqual(
        mockCard,
      );
    });

    it('should receive error not found if card does not exist', async () => {
      jest.spyOn(cardsService, 'findById').mockImplementation(() => null);
      await controller.getCard('5cc60519d3f5e97094381fd6').catch(e => {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Card not found',
        });
      });
    });

    it('should receive error unauthorized if user not owner of card', async () => {
      const result = {
        expiration: {
          month: 2,
          year: 2026,
        },
        _id: '5cc60519d3f5e97094381fd5',
        number: '233432323457',
        cardHolderName: 'Josh',
        cvv: 232,
        creditLimit: 6675.76,
        closingDay: 24,
        wallet: '5cc60505d3f5e97094381fd4',
        user: '5cc4f2424cd7977d263fc2c7',
      };

      // @ts-ignore
      jest.spyOn(cardsService, 'findById').mockImplementation(() => result);
      await controller.getCard('5cc60519d3f5e97094381fd6').catch(e => {
        expect(e.response).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
        });
      });
    });
  });

  describe('Delete Card', () => {
    it('should delete card', async () => {
      await jest
        .spyOn(cardsService, 'findById')
        // @ts-ignore
        .mockImplementation(() => mockCard);
      await jest
        .spyOn(walletsService, 'deleteCard')
        .mockImplementation(() => null);
      await jest.spyOn(cardsService, 'delete').mockImplementation(() => null);

      expect(await controller.deleteCard('5cc60519d3f5e97094381fd6')).toEqual({
        statusCode: 200,
        message: 'Card has been deleted',
      });
    });

    it('should receive error not found if card does not exist', async () => {
      jest.spyOn(cardsService, 'findById').mockImplementation(() => null);
      await controller.deleteCard('5cc60519d3f5e97094381fd6').catch(e => {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Card not found',
        });
      });
    });

    it('should receive error unauthorized if user not owner of card', async () => {
      const result = {
        expiration: {
          month: 2,
          year: 2026,
        },
        _id: '5cc60519d3f5e97094381fd5',
        number: '233432323457',
        cardHolderName: 'Josh',
        cvv: 232,
        creditLimit: 6675.76,
        closingDay: 24,
        wallet: '5cc60505d3f5e97094381fd4',
        user: '5cc4f2424cd7977d263fc2c7',
      };

      // @ts-ignore
      jest.spyOn(cardsService, 'findById').mockImplementation(() => result);
      await controller.deleteCard('5cc60519d3f5e97094381fd6').catch(e => {
        expect(e.response).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
        });
      });
    });
  });
});
