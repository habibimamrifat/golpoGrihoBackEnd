import mongoose from 'mongoose';
import { TIvestOrExpennces } from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';
import memberModel from '../members/member.model';
import { investmentUtillFunctions } from './expenceLemitationCheck.utill';
import { stringify } from 'querystring';

const createInvestOrExpaces = async (payload: TIvestOrExpennces) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await InvestOrExpensesModel.create([payload], { session });

    if (result[0]._id) 
    {
      // console.log(result);
      const isInvestment = await investmentUtillFunctions.checkIfInvestment(
        result[0]._id,
        session,
      );

      // console.log(isInvestment);

      if (!isInvestment) {
        const expencceCalclution =
          await investmentUtillFunctions.calclutionForGrossReduction(
            result[0].ammountSpent,
            session,
          );
      } 
      else 
      {
        console.log('not investment');
      }
    }
  } catch (err: any) {
    console.log('error in createInvestOrExpaces');
    throw Error(err.message || 'error in createInvestOrExpaces');
  }
};

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
};
