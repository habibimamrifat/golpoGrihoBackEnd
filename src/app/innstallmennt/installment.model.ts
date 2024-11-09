import mongoose, { Schema, Document, Types, model } from 'mongoose';
import {
  TInstallment,
  TInstallmentList,
  TMonth,
} from './installment.interface';
import { date } from 'zod';

// Define the TMonth type as an enum for the schema
const monthEnum: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Define the TDeposit schema
const InstallmentSchema = new Schema<TInstallment>({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    enum: monthEnum, // Using enum to restrict to the months
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'declined', 'approved'],
    default: 'waiting',
  },
  installmentDate: {
    type: Date,
    default: () => new Date(),
  },
});

// Define the TDepositList schema
const InstallmentListSchema = new Schema<TInstallmentList>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  totalDeposit: {
    type: Number,
    default: 0,
  },

  depositList: {
    type: [InstallmentSchema],
    default: [],
    required: true,
  },
});

// Create Mongoose models
export const InstallmentListtModel = model(
  'Installment',
  InstallmentListSchema,
);
