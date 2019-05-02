import { CardsService } from './cards.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

describe('WalletService', () => {
  let service: CardsService;

  const docs = [
    {
      expiration: {
        month: 2,
        year: 2026,
      },
      _id: '5cc60519d3f5e97094381fd5',
      number: '233432323232',
      cardHolderName: 'Josh',
      cvv: 232,
      creditLimit: 6675.76,
      closingDay: 24,
      wallet: '5cc60505d3f5e97094381fd4',
      user: '5cc4f2424cd7977d263fc2c0',
    },
  ];

  const repoMock = {
    create(card) {
      if (!card.number) {
        throw new Error('Mongoose error');
      }
      if (docs.filter(doc => doc.number === card.number).length > 0) {
        throw new Error('E11000');
      }
      return card;
    },
    findByIdAndRemove(cardId) {
      return cardId;
    },
    findById(cardId) {
      return docs.filter(doc => doc._id === cardId)[0];
    },
    find(search) {
      if (search) {
        if (search.user) {
          return docs.filter(doc => doc.user === search.user)[0];
        }
      }
      return docs;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getModelToken('Card'),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  describe('Create Card', () => {
    it('should create a card', async () => {
      const card = {
        expiration: {
          month: 2,
          year: 2026,
        },
        number: '233432323457',
        cardHolderName: 'Josh',
        cvv: 232,
        creditLimit: 6675.76,
        closingDay: 24,
        wallet: '5cc60505d3f5e97094381fd4',
        user: '5cc4f2424cd7977d263fc2c0',
      };
      const userId = '5cc4f2424cd7977d263fc2c0';
      const walletId = '5cc60505d3f5e97094381fd4';
      await service.create(card, walletId, userId).then(res => {
        expect(res.number).toEqual('233432323457');
      });
    });

    it('should receive error if the card already exists', async () => {
      const card = {
        expiration: {
          month: 2,
          year: 2026,
        },
        number: '233432323232',
        cardHolderName: 'Josh',
        cvv: 232,
        creditLimit: 6675.76,
        closingDay: 24,
        wallet: '5cc60505d3f5e97094381fd4',
        user: '5cc4f2424cd7977d263fc2c0',
      };
      const userId = '5cc4f2424cd7977d263fc2c0';
      const walletId = '5cc60505d3f5e97094381fd4';
      await service.create(card, walletId, userId).catch(e => {
        expect(e.response).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Card already exists',
        });
      });
    });

    it('should receive error if an error occurs in the mongoose', async () => {
      const userId = '5cc4f2424cd7977d263fc2c0';
      const walletId = '5cc60505d3f5e97094381fd4';
      await service.create({}, walletId, userId).catch(e => {
        expect(e.response).toEqual({
          statusCode: 500,
          error: 'Internal Server Error',
        });
      });
    });
  });

  describe('Delete Card', () => {
    it('should delete card', async () => {
      const cardId = '5cc60519d3f5e97094381fd5';
      expect(await service.delete(cardId)).toEqual(cardId);
    });
  });

  describe('Get by Id', () => {
    it('should get card by id', async () => {
      const cardId = '5cc60519d3f5e97094381fd5';
      expect(await service.findById(cardId)).toEqual(docs[0]);
    });
  });

  describe('Get by user id', () => {
    it('should get card by user id', async () => {
      const userId = '5cc4f2424cd7977d263fc2c0';
      expect(await service.getByUserId(userId)).toEqual(docs[0]);
    });
  });

  describe('Get all cards', () => {
    it('should get all cards', async () => {
      expect(await service.index()).toEqual(docs);
    });
  });
});
