import mongoose from 'mongoose';
import { TIvestOrExpennces } from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';
import memberModel from '../members/member.model';
import { investmentUtillFunctions } from './expenceLemitationCheck.utill';
import { stringify } from 'querystring';

const createInvestOrExpaces = async (payload: TIvestOrExpennces) => {
  // const isInLimit = await expenceBeyondTotalCurrentBalanceCheck(
  //   payload.ammountSpent,
  // );
  // if (isInLimit.success) {
  //   const result = await InvestOrExpensesModel.create(payload);
  //   return result;
  // } else {
  //   throw new Error(`${isInLimit.message}`);
  // }

  // ............................................................................................

  const result = await InvestOrExpensesModel.create(payload);
  if(result)
  {
    const isInvestment = await investmentUtillFunctions.checkIfInvestment(result._id)
    console.log(isInvestment)
  }
    

};

const fidAllIvestmetAndExpences = async () => {
  const result = await InvestOrExpensesModel.find();
  return result;
};

const findSingleIvestmetAndExpences = async (investOrExpece_Id: string,id: string,) => {
  const IvestmetAndExpences = await InvestOrExpensesModel.findOne({
    _id: new mongoose.Types.ObjectId(investOrExpece_Id),
  });

  const findMember = await memberModel.findOne({id:id})


  console.log(IvestmetAndExpences,findMember);
};


export const investOrExpencesServeces = {
  createInvestOrExpaces,
  fidAllIvestmetAndExpences,
  findSingleIvestmetAndExpences,
};
