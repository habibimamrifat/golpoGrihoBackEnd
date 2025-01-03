import { Schema, model } from 'mongoose';
import {
  TInstallment,
  TInstallmentList,
  TMonth,
} from './installment.interface';
import { number } from 'zod';

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
  installmentAmount: {
    type: Number,
    required: true,
    min: 1000,
  },
  numberOfMonth:{
    type:Number,
    default:1,
    min:1,
    max:12
  },
  transactionImg: {
    type: String,
    required: false,
  },
  acceptedBy: {
    type: String,
    required: false,
    default:null
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

  installmentList: {
    type: [InstallmentSchema],
    default: [],
    required: true,
  },
  isDelited: { type: Boolean, default: false },
},
{
  timestamps:true
});

InstallmentListSchema.pre('save', async function (next) {
  // console.log('yoo');
  const result = await InstallmentListtModel.findOne({
    id: this.id,
  });

  console.log('result', result);

  if (result) {
    throw new Error('This user already Exists');
  }
  next();
});

// Create Mongoose models
export const InstallmentListtModel = model<TInstallmentList>(
  'Installment',
  InstallmentListSchema,
);
