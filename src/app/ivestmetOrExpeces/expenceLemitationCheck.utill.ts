import mongoose, { ClientSession } from 'mongoose';
import { BannerMOdel } from '../banner/banner.model';
import { InvestOrExpensesModel } from './investOrExpence.model';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { BannerServeces } from '../banner/banner.servicces';
import { TIvestmentCycleIput } from './investOrExpence.interface';

const findLastexpenceOrInvestment = async (session: ClientSession) => {
  const lastRegisteredId = await InvestOrExpensesModel.findOne({}, { id: 1 })
    .sort({ createdAt: -1 })
    .session(session); // Attach the session to the query

  return lastRegisteredId?.id.slice(3) || undefined;
};

const expenceOrInvestmentIdGeneretor = async (
  pattern: string,
  session: ClientSession,
) => {
  const currentId =
    (await findLastexpenceOrInvestment(session)) || (0).toString();

  // Increment and pad the ID
  let convertedId = (Number(currentId) + 1).toString().padStart(4, '0');

  // Construct the final ID
  convertedId = `${pattern.slice(0, 3)}${convertedId}`;

  console.log(convertedId);
  return convertedId;
};

// ......................id generator up ................

const expenceBeyondTotalCurrentBalanceCheck = async (
  expenceAmmount: number,
  session?: ClientSession,
): Promise<{ success: boolean; message: string }> => {
  try {
    const bannerData = session
      ? await BannerMOdel.findOne().session(session)
      : await BannerMOdel.findOne();

    if (bannerData && typeof bannerData.grossTotalBalance === 'number') {
      if (bannerData.grossTotalBalance >= expenceAmmount) {
        return {
          success: true,
          message: 'Expense is within the current balance',
        };
      } else {
        return {
          success: false,
          message: 'The expense is beyond the Current Total Balance',
        };
      }
    } else {
      return {
        success: false,
        message: 'Banner data or currentTotalBalance is missing',
      };
    }
  } catch (err) {
    console.error('Error in expenceBeyondTotalCurrentBalanceCheck:', err);
    return {
      success: false,
      message: 'An unexpected error occurred while checking the balance',
    };
  }
};

const checkIfInvestment = async (
  investmentId: string,
  session?: mongoose.ClientSession,
): Promise<boolean> => {
  try {
    // Find the investment document
    const findInvestment = session
      ? await InvestOrExpensesModel.findOne({
          id: investmentId,
        }).session(session)
      : await InvestOrExpensesModel.findOne({
          id: investmentId,
        });

    if (!findInvestment) {
      throw new Error('Investment not found');
    }

    // Check if the document is an investment
    return findInvestment.ExpencesType === 'investment';
  } catch (err: any) {
    console.error('Error in checkIfInvestment:', err.message);
    throw new Error(err.message || 'Error occurred while checking investment');
  }
};

const calcluateOfASingleInstallment = async (
  payload: TIvestmentCycleIput,
  session?: ClientSession,
) => {
  const isDisCOntinued = session
    ? await InvestOrExpensesModel.findOne({
        id: payload.id,
        isDiscontinued: false,
      }).session(session)
    : await InvestOrExpensesModel.findOne({
        id: payload.id,
        isDiscontinued: false,
      });
  if (!isDisCOntinued) {
    console.log('this Investment Is Discontinued');
    throw Error('this Investment Is Discontinued');
  }

  const cycleInput = payload.cycleInput


  const addToInvestmentCycle = 
  
};

const calclutionForGrossReductionOrAddition = async (
  amountSpent: number,
  nature: 'reduction' | 'addition',
  session?: mongoose.ClientSession,
) => {
  console.log('problem', amountSpent, nature);
  try {
    const bannerData = session
      ? await BannerMOdel.findOne({}).session(session)
      : await BannerMOdel.findOne({});

    if (!bannerData) {
      throw new Error('Banner data not found');
    }

    const expensePerHead = amountSpent / bannerData.totalNumberOfShare;

    const allMemberShareDetail = session
      ? await ShareDetailModel.find().session(session)
      : await ShareDetailModel.find();

    const updateArr: { id: string; grossPersonalBalanceUpdated: number }[] = [];

    allMemberShareDetail.forEach((eachShareDetail) => {
      let grossPersonalBalanceUpdated = 0;
      if (nature === 'reduction') {
        grossPersonalBalanceUpdated =
          eachShareDetail.grossPersonalBalance -
          expensePerHead * eachShareDetail.numberOfShareWonedPersonally;
      } else if (nature === 'addition') {
        grossPersonalBalanceUpdated =
          eachShareDetail.grossPersonalBalance +
          expensePerHead * eachShareDetail.numberOfShareWonedPersonally;
      }
      // console.log(grossPersonalBalanceUpdated);

      updateArr.push({
        id: eachShareDetail.id,
        grossPersonalBalanceUpdated: grossPersonalBalanceUpdated,
      });
    });

    // console.log('run map on it ',  updateArr);

    const updateMembersGrossPersonalBalance = updateArr.map(
      async (eachupdate) => {
        const updateOption = session ? { new: true, session } : { new: true };
        return await ShareDetailModel.findOneAndUpdate(
          { id: eachupdate.id },
          { grossPersonalBalance: eachupdate.grossPersonalBalanceUpdated },
          updateOption,
        );
      },
    );

    const result = await Promise.all(updateMembersGrossPersonalBalance);

    const bannerGrosstotalBalanceUpdate = session
      ? await BannerServeces.updateBannerGrossTotalBalance(session)
      : await BannerServeces.updateBannerGrossTotalBalance();

    return result;
  } catch (err: any) {
    console.log('error occared in calclutionForExpences');
    throw Error(err.message || 'error occared in calclutionForExpences');
  }
};

export const investmentUtillFunctions = {
  expenceOrInvestmentIdGeneretor,
  expenceBeyondTotalCurrentBalanceCheck,
  checkIfInvestment,
  calcluateOfASingleInstallment,
  calclutionForGrossReductionOrAddition,
};
