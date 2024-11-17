import { model, Schema } from 'mongoose';
import {
  TIvestmentCycleIput,
  TIvestOrExpennces,
} from './investOrExpence.interface';

// Define the Investment Cycle Schema
const InvestmentCycleSchema = new Schema<TIvestmentCycleIput>({
  cyclename: { type: String, required: true },
  cycleType: {
    type: String,
    enum: ['reinvest', 'profit', 'loss'],
    required: true,
  },
  ammount: { type: Number, required: true },
  proofImg: { type: String, required: false },
});

// Define the Main Schema for Investment or Expenses
const InvestOrExpensesSchema = new Schema<TIvestOrExpennces>({
  motiveName: { type: String, required: true },
  ExpencesType: {
    type: String,
    enum: ['investment', 'expence'],
    required: true,
  },
  ammountSpent: { type: Number, required: true },
  profitGenareted:{type:Number, required:false ,default:0},
  madeLoss:{type:Number, required:false ,default:0},
  expenceImg: { type: String, required: false },
  investmentCycle: {
    type: [InvestmentCycleSchema],
    default:[]
  },
});

export const InvestOrExpensesModel = model(
  'InvestOrExpenses',
  InvestOrExpensesSchema,
);
