import { model, Schema } from 'mongoose';
import {
  TContributionDetail,
  TDestrubutionOfShares,
  TIvestmentCycleIput,
  TIvestOrExpennces,
} from './investOrExpence.interface';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';

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


const DestrubutionOfSharesSchema = new Schema<TDestrubutionOfShares>({
  id: {
    type: String,
    required: true,
    unique: true, // Ensures each `id` is unique
  },
  numberOfShareOwned: {
    type: Number,
    required: true,
    min: 0, // Ensure the number of shares is non-negative
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
  destrubutionOfShares:{
    type:[DestrubutionOfSharesSchema],
    default:[]
  },
  investmentCycle: {
    type: [InvestmentCycleSchema],
    default: [],
  },
  contributionList:{type:[ContributionDetailSchema], default:[]}
},
{
  timestamps:true
});


InvestOrExpensesSchema.pre("save", async function (next) {
  try {
    // Fetch all shares
    const findAllTheShares = await ShareDetailModel.find();

    // Prepare the array of distribution of shares
    const updateDestrubutionOfSharesArrey: TDestrubutionOfShares[] = findAllTheShares.map((eachShare) => ({
      id: eachShare.id,
      numberOfShareOwned: eachShare.numberOfShareWonedPersonally, // Use the correct field name
    }));

    // Set the destrubutionOfShares property
    const investOrExpence = this 
    investOrExpence.destrubutionOfShares = updateDestrubutionOfSharesArrey;

    next();
  } catch (error:any) {
    next(error); // Pass the error to Mongoose if something goes wrong
  }
});

export const InvestOrExpensesModel = model(
  'InvestOrExpenses',
  InvestOrExpensesSchema,
);
