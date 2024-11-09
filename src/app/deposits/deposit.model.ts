import mongoose, { Schema, Document, Types, model } from 'mongoose';
import { TDeposit, TDepositList, TMonth } from './deposit.interface';

// Define the TMonth type as an enum for the schema
const monthEnum : TMonth[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Define the TDeposit schema
const DepositSchema = new Schema<TDeposit>({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    enum: monthEnum,  // Using enum to restrict to the months
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  status:{
    type:String,
    enum:["waiting","declined","approved"],
    default:"waiting"
  }
});

// Define the TDepositList schema
const DepositListSchema = new Schema<TDepositList>({
  id: {
    type: String,
    required: true,
    unique:true
  },

  totalDeposit: {
    type: Number,
    default:0
  },

  depositList: {
    type: [DepositSchema],
    default:[],
    required: true,
  }
});

// Create Mongoose models
export const DepositListtModel = model("Deposit",DepositListSchema)
