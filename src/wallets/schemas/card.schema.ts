import * as mongoose from 'mongoose';
import { WalletSchema } from './wallet.schema';

export const CardSchema = new mongoose.Schema({
    wallet: String,
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
}, { timestamps: true });
