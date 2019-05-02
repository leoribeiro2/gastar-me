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
    expirationDate: Date,
    limits: {
      total: Number,
      used: {
        type: Number,
        default: 0,
      },
      remaining: {
        type: Number,
      },
    },
    closingDay: Number,
  },
  {
    timestamps: true,
  },
);
