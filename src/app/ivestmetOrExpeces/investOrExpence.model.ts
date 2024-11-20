import { model, Schema } from 'mongoose';
import {
  TIvestmentCycleIput,
  TIvestOrExpennces,
} from './investOrExpence.interface';

// Define the Investment Cycle Schema
const InvestmentCycleSchema = new Schema<TIvestmentCycleIput>({
  id: {
    type: String,
    required: true,
  },
  cycleDetail: {
    type: String,
    required: true,
  },
  cycleType: {
    type: String,
    enum: ['investmentReturn', 'reInvest'], // Restricted to specific values
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  proofImg: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Define the Main Schema for Investment or Expenses
const InvestOrExpensesSchema = new Schema<TIvestOrExpennces>({
  id: { type: String, required: true },
  motiveName: { type: String, required: true },
  expenceImg: { type: String, required: false },

  ExpencesType: {
    type: String,
    enum: ['investment', 'expence'],
    required: true,
  },
  ammountSpent: { type: Number, required: true },
  profitGenareted: { type: Number, default: 0 },
  madeLoss: { type: Number, default: 0 },
  isDiscontinued: { type: Boolean, default: false },
  investmentCycle: {
    type: [InvestmentCycleSchema],
    default: [],
  },
});

export const InvestOrExpensesModel = model(
  'InvestOrExpenses',
  InvestOrExpensesSchema,
);
