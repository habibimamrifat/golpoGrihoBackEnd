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
    index:false
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
  // console.log("i am being called from pre sasve")
  try {

    const query = [
      {
        $lookup: {
          from: "users", // Name of the collection to join
          localField: "id", // Field in the current collection
          foreignField: "id", // Field in the users collection
          as: "usersDetails", // Alias for the joined documents
        },
      },
      {
        $unwind: "$usersDetails", // Deconstruct the array from $lookup
      },
      {
        $match: {
          "usersDetails.requestState": "approved",
           // Only keep the group with _id "approved"
           "usersDetails.isDelited":false
        },
      },
    ];
    // Fetch all shares
    const findAllTheShares = await ShareDetailModel.aggregate(query);

    // console.log("from model", findAllTheShares)

    // Prepare the array of distribution of shares
    const updateDestrubutionOfSharesArrey = findAllTheShares.map((eachShare) => ({
      id: eachShare.id,
      numberOfShareOwned: eachShare.numberOfShareWonedPersonally, // Use the correct field name
    }));

    // console.log("update Destrubution Of SharesArrey",updateDestrubutionOfSharesArrey)

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
