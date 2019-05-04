import { CardsService } from './cards.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as moment from 'moment';

describe('WalletService', () => {
  let service: CardsService;

  const docs = [
    {
      expiration: {
        month: 12,
        year: 2019,
      },
      _id: '5cc60519d3f5e97094381fd5',
      number: '2343432323232',
      cardHolderName: 'Josh',
      cvv: 232,
      limits: {
        total: 4000,
        used: 1000,
        remaining: 3000,
      },
      closingDay: 10,
      wallet: '5cc60505d3f5e97094381fd4',
      user: '5cc4f2424cd7977d263fc2c0',
    },
    {
      expiration: {
        month: 2,
        year: 2022,
      },
      _id: '5cc60519d3f5e97094381fd6',
      number: '2332432323232',
      cardHolderName: 'Josh',
      cvv: 232,
      limits: {
        total: 5655,
        used: 200,
        remaining: 5455,
      },
      closingDay: 5,
      wallet: '5cc60505d3f5e97094381fd4',
      user: '5cc4f2424cd7977d263fc2c0',
    },
    {
      expiration: {
        month: 5,
        year: 2018,
      },
      _id: '5cc60519d3f5e97094381fd7',
      number: '2334323233232',
      cardHolderName: 'Josh',
      cvv: 232,
      limits: {
        total: 5000,
        used: 500,
        remaining: 4500,
      },
      closingDay: 20,
      wallet: '5cc60505d3f5e97094381fd4',
      user: '5cc4f2424cd7977d263fc2c0',
    },
    {
      expiration: {
        month: 2,
        year: 2026,
      },
      _id: '5cc60519d3f5e97094381fd8',
      number: '2334323234232',
      cardHolderName: 'Josh',
      cvv: 232,
      limits: {
        total: 8400,
        used: 1300,
        remaining: 7100,
      },
      closingDay: 25,
      wallet: '5cc60505d3f5e97094381fd5',
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
        } else if (search.wallet) {
          return {
            sort() {
              return docs
                .filter(doc => doc.wallet === search.wallet)
                .map(doc => ({ _doc: doc }));
            },
          };
        }
      }
      return docs;
    },
    findByIdAndUpdate(id, data) {
      const obj = docs.filter(card => card._id === id)[0];

      return {
        ...obj,
        limits: {
          used: data['limits.used'],
          remaining: data['limits.remaining'],
        },
      };
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

  describe('Get Best Cards', () => {
    it('should retrieve and sort best cards on list of 4', async () => {
      const walletId = '5cc60505d3f5e97094381fd4';

      await service
        .getBestCards(walletId, moment('02-05-2019', 'DD-MM-YYYY'))
        .then((cards: any) => {
          expect(cards[0]._id).toEqual('5cc60519d3f5e97094381fd7');
          expect(cards[1]._id).toEqual('5cc60519d3f5e97094381fd5');
        });
    });

    it('should receive bad request error if wallet not contains valid cards', async () => {
      const walletId = '5cc60505d3f5e97094381fd1';

      await service
        .getBestCards(walletId, moment('02-05-2019', 'DD-MM-YYYY'))
        .catch(e => {
          expect(e.response).toEqual({
            statusCode: 400,
            error: 'Bad Request',
            message: 'You do not have eligible cards for this transaction.',
          });
        });
    });
  });

  describe('Update Limits', () => {
    it('should update limits of card', async () => {
      const id = '5cc60519d3f5e97094381fd5';
      const data = {
        used: 1300,
        remaining: 2700,
      };

      await service.updateLimits(id, data).then(card => {
        expect(card._id).toEqual(id);
        expect(card.limits.used).toEqual(data.used);
        expect(card.limits.remaining).toEqual(data.remaining);
      });
    });
  });
});
