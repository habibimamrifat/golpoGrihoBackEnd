import mongoose from 'mongoose';
import { TIvestmentCycleIput, TIvestOrExpennces } from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';
import memberModel from '../members/member.model';
import { investmentUtillFunctions } from './expenceLemitationCheck.utill';
import { stringify } from 'querystring';


const createInvestOrExpaces = async (payload: TIvestOrExpennces) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const isInGrossTotalBalanceLimit =
      await investmentUtillFunctions.expenceBeyondTotalCurrentBalanceCheck(
        payload.ammountSpent,
        session,
      );

    if (isInGrossTotalBalanceLimit.success) {
      const result = await InvestOrExpensesModel.create([payload], { session });

      if (result[0]._id) {
        const expencceCalclution =
          await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
            result[0].ammountSpent,
            "reduction",
            session,
          );

        await session.commitTransaction();
        await session.endSession();
        return result;
      } else {
        throw Error(`creating a Investment or Expences was not Successfull`);
      }
    } else {
      throw Error(`${isInGrossTotalBalanceLimit.message}`);
    }
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    console.log('error in createInvestOrExpaces');
    throw Error(err.message || 'error in createInvestOrExpaces');
  }
};

const giveAInputInInvestmentCycle =async (payload: TIvestmentCycleIput)=>{
  const session = await mongoose.startSession()
  try{
    // const isInvestment = await investmentUtillFunctions.checkIfInvestment()

  }
  catch(err:any)
  {
    await session.abortTransaction()
    await session.endSession()
    console.log("something went wrong in giveAInputInInvestmentCycle")
    throw Error(err.message || "something went wrong in giveAInputInInvestmentCycle")
  }
}

const fidAllIvestmetAndExpences = async () => {
  const result = await InvestOrExpensesModel.find();
  return result;
};

const findSingleIvestmetAndExpences = async (
  investOrExpece_Id: string,
  id: string,
) => {
  const IvestmetAndExpences = await InvestOrExpensesModel.findOne({
    _id: new mongoose.Types.ObjectId(investOrExpece_Id),
  });

  const findMember = await memberModel.findOne({ id: id });

  console.log(IvestmetAndExpences, findMember);
};

export const investOrExpencesServeces = {
  createInvestOrExpaces,
  fidAllIvestmetAndExpences,
  findSingleIvestmetAndExpences,
  giveAInputInInvestmentCycle
};
