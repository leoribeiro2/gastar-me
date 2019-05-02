import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    cards: [
      {
        card: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Card',
        },
        amount: Number,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: String,
    totalAmount: Number,
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
