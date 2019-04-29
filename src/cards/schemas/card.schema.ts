import * as mongoose from 'mongoose';

export const CardSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    number: {
      type: String,
    },
    cardHolderName: String,
    cvv: Number,
    expiration: {
      month: Number,
      year: Number,
    },
    creditLimit: Number,
    closingDay: Number,
  },
  { timestamps: true },
);
