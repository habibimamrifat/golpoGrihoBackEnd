import mongoose from 'mongoose';
import {
  TIvestmentCycleIput,
  TIvestOrExpennces,
} from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';
import memberModel from '../members/member.model';
import { investmentUtillFunctions } from './expenceLemitationCheck.utill';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { BannerMOdel } from '../banner/banner.model';

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

        if (payload.ExpencesType === 'investment') {
          const makeADefaultInvestment =
            await InvestOrExpensesModel.findOneAndUpdate(
              { _id: result[0]._id },
              {
                $push: {
                  investmentCycle: {
                    id: result[0].id,
                    cycleDetail: result[0].motiveName,
                    cycleType: 'investment',
                    amount: result[0].ammountSpent,
                    proofImg: result[0].expenceImg,
                  },
                },
              },
            ).session(session);

          if (!makeADefaultInvestment) {
            console.log('have problem making default investment');
            throw Error('have problem making default investment');
          }
        }

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
  session.startTransaction();

  try {
    const isInvestment = await investmentUtillFunctions.checkIfInvestment(
      payload.id,
    );
    if (!isInvestment) {
      console.log('cant add input cycle to a Expences, its not investment');
      throw Error('cant add input cycle to a Expences, its not investment');
    }

    const isDiscontinued = await investmentUtillFunctions.checkIsDisCOntinued(
      payload.id,
    );
    if (isDiscontinued) {
      console.log('this Investment Is Discontinued');
      throw Error('this Investment Is Discontinued');
    }

    const updateInvestmentCycle =
      await investmentUtillFunctions.updateInvestmentCycle(payload);
    if (!updateInvestmentCycle) {
      console.log('couldent uppdate Investment cycle');
      throw Error('couldent uppdate Investment cycle');
    }

    const analysisInvestmentTransactionList =
      await investmentUtillFunctions.analisisInvestmentTransactionList(payload);
    if (!analysisInvestmentTransactionList) {
      console.log('couldnt analysis Investment Transaction List');
      throw Error('couldnt analysis Investment Transaction List');
    }
    console.log(analysisInvestmentTransactionList);
    const { investmentTotal, reInvestTotal, investmentReturnTotal } =
      analysisInvestmentTransactionList;

    // calculation based on analysis of investment cycle list PROFITGENNARATED or MADELOSS
    const netOutcome =
      investmentReturnTotal - (reInvestTotal + investmentTotal);
    const ammountSpent = reInvestTotal + investmentTotal;

    const updateGrossOutcomeOfaInvestment =
      await investmentUtillFunctions.updateGrossOutcomeOfaInvestment(
        payload.id,
        netOutcome,
        ammountSpent,
      );
    if (!updateGrossOutcomeOfaInvestment) {
      console.log('couldnt exacute updateGrossOutcomeOfa Investment');
      throw Error('couldnt exacute updateGrossOutcomeOfa Investment');
    }

    // only optional part of investment cycle

    if (payload.cycleType === 'reInvest') {
      const destrybuteProfiteOrLossToAll =
        await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
          payload.amount,
          'reduction',
          session,
        );
    } else {
      const destrybuteProfiteOrLossToAll =
        await investmentUtillFunctions.calclutionForGrossReductionOrAddition(
          netOutcome,
          'addition',
          session,
        );
    }

    // commit the changes
    await session.commitTransaction();
    return updateGrossOutcomeOfaInvestment;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw {
      success: false,
      message: err.message || 'An unknown error occurred.',
    };
  }
};

const disContinueANInvestment = async (investmentId: string) => {
  const result = await InvestOrExpensesModel.findOneAndUpdate(
    { id: investmentId },
    { isDiscontinued: true },
    { new: true },
  );
  return result;
};

const fidAllIvestmetAndExpences = async () => {
  const result = await InvestOrExpensesModel.find();
  return result;
};

const findSingleIvestmetAndExpences = async (
  investOrExpeceId: string,
  id: string,
) => {
  const findInvestmetOrExpences = await InvestOrExpensesModel.findOne({id:investOrExpeceId});
  const findMember = await ShareDetailModel.findOne({ id: id });
  const findBannerData= await BannerMOdel.findOne()

  console.log(findInvestmetOrExpences, findMember,findBannerData);

  const status = findInvestmetOrExpences?
  findInvestmetOrExpences?.profitGenareted > 0
    ? "In Profit"
    : findInvestmetOrExpences?.profitGenareted === 0 && findInvestmetOrExpences?.madeLoss ===0 ?"Nutral" : "In Loss" :null



};

export const investOrExpencesServeces = {
  createInvestOrExpaces,
  fidAllIvestmetAndExpences,
  findSingleIvestmetAndExpences,
  giveAInputInInvestmentCycle,
  disContinueANInvestment,
};
