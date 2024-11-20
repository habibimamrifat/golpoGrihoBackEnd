import mongoose from 'mongoose';
import {
  TIvestmentCycleIput,
  TIvestOrExpennces,
} from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';
import memberModel from '../members/member.model';
import { investmentUtillFunctions } from './expenceLemitationCheck.utill';

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
      const string = payload.ExpencesType.slice(0, 3);
      const idGenarated =
        await investmentUtillFunctions.expenceOrInvestmentIdGeneretor(
          `${string}`,
          session,
        );
      if (idGenarated) {
        payload.id = idGenarated;
        const result = await InvestOrExpensesModel.create([payload], {
          session,
        });

        if (result[0]._id) {
          const expencceCalclution =
            await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
              result[0].ammountSpent,
              'reduction',
              session,
            );

          await session.commitTransaction();
          await session.endSession();
          return result;
        } else {
          throw Error(`creating a Investment or Expences was not Successfull`);
        }
      } else {
        console.log('something went wrong in idGeneretor');
        throw Error('something went wrong in idGeneretor');
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

const giveAInputInInvestmentCycle = async (payload: TIvestmentCycleIput) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isInvestment = await investmentUtillFunctions.checkIfInvestment(
      payload.id,
      session,
    );
    if (isInvestment) {
      const investment = payload.cycleInput;
      if (investment.cycleType === 'investmentReturn') {
        const grossAddition =
          await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
            investment.amount,
            'addition',
            session,
        );
        if (!grossAddition) 
        {
          console.log('something went wrong in calcluting grossAddition ');
          throw Error('something went wrong in calcluting grossAddition');
        }

        // implementing investment logic
        await investmentUtillFunctions.calcluateOfASingleInstallment (payload,session)
      } 

      else if (investment.cycleType === 'reInvest') {
        const investmentLimitCheck =await investmentUtillFunctions.expenceBeyondTotalCurrentBalanceCheck(investment.amount,session);
        if (!investmentLimitCheck.success)
        {
          console.log('something went wrong in calcluting grossAddition ');
          throw Error('something went wrong in calcluting grossAddition');
        }

        const grossReduction =await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
        investment.amount,'reduction',session);
        if (!grossReduction) 
        {
        console.log('something went wrong in calcluting grossReduction ');
        throw Error('something went wrong in calcluting grossReduction');
        } 
        // add investment logic
        await investmentUtillFunctions.calcluateOfASingleInstallment (payload,session)
      }

      await session.commitTransaction();
    } else {
      console.log('cant add input cycle to a Expences, its not investment');
      throw Error('cant add input cycle to a Expences, its not investment');
    }
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    console.log('something went wrong in giveAInputInInvestmentCycle');
    throw Error(
      err.message || 'something went wrong in giveAInputInInvestmentCycle',
    );
  }
};

const fidAllIvestmetAndExpences = async () => {
  const result = await InvestOrExpensesModel.find();
  return result;
};

const findSingleIvestmetAndExpences = async (
  investOrExpeceId: string,
  id: string,
) => {
  const IvestmetAndExpences = await InvestOrExpensesModel.findOne({
    id: investOrExpeceId,
  });

  const findMember = await memberModel.findOne({ id: id });

  console.log(IvestmetAndExpences, findMember);
};

export const investOrExpencesServeces = {
  createInvestOrExpaces,
  fidAllIvestmetAndExpences,
  findSingleIvestmetAndExpences,
  giveAInputInInvestmentCycle,
};
