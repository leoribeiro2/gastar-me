import * as mongoose from 'mongoose';
import { CardSchema } from '../../cards/schemas/card.schema';

export const WalletSchema = mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

/*
WalletSchema.virtual('totalLimit')
  .get(function() {
    if (this.cards.length > 0) {
      const total = this.cards.reduce((acc, act) => ({creditLimit: acc.creditLimit + act.creditLimit}));
      return total.creditLimit;
    } else {
      return 0;
    }
  });
*/
