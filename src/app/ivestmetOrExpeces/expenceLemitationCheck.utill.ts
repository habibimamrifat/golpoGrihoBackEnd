import mongoose from 'mongoose';
import { BannerMOdel } from '../banner/banner.model';
import { InvestOrExpensesModel } from './investOrExpence.model';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { BannerServeces } from '../banner/banner.servicces';

const expenceBeyondTotalCurrentBalanceCheck = async (
  expenceAmmount: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const bannerData = await BannerMOdel.findOne();

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
  investment_id: string | mongoose.Types.ObjectId,
  session?: mongoose.ClientSession,
): Promise<boolean> => {
  try {
    // Ensure `_id` is a string
    const _id =
      typeof investment_id === 'object' &&
      investment_id instanceof mongoose.Types.ObjectId
        ? investment_id.toHexString()
        : investment_id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error('Invalid investment ID');
    }

    // Find the investment document
    const findInvestment = session
      ? await InvestOrExpensesModel.findOne({
          _id: new mongoose.Types.ObjectId(_id),
        }).session(session)
      : await InvestOrExpensesModel.findOne({
          _id: new mongoose.Types.ObjectId(_id),
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

const calcluateOfAsingleInstallment = async (investment_id: string) => {
  const isInvestment = await checkIfInvestment(investment_id);
  if (isInvestment) {
    const calculate = await InvestOrExpensesModel.aggregate([
      { $match: { _id: investment_id } },
    ]);
  }
};

const calclutionForGrossReduction = async (
  amountSpent: number,
  session?: mongoose.ClientSession,
) => {
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
      const grossPersonalBalanceUpdated =
        eachShareDetail.grossPersonalBalance -
        expensePerHead * eachShareDetail.numberOfShareWonedPersonally;
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
  expenceBeyondTotalCurrentBalanceCheck,
  checkIfInvestment,
  calcluateOfAsingleInstallment,
  calclutionForGrossReduction,
};
