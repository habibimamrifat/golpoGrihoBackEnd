import { model, Schema } from 'mongoose';
import {
  TContributionDetail,
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

const ContributionDetailSchema = new Schema<TContributionDetail>({
  id: {
    type: String,
    required: true,
  },
  accuriedShare: {
    type: Number,
    required: true,
  },
  contribution: {
    type: Number,
    required: true,
  },
  contributionType: {
    type: String,
    required: true,
  },
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
  contributionList:{type:[ContributionDetailSchema], default:[]}
},
{
  timestamps:true
});

export const InvestOrExpensesModel = model(
  'InvestOrExpenses',
  InvestOrExpensesSchema,
);
