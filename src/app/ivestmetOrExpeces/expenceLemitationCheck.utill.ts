import mongoose from 'mongoose';
import { BannerMOdel } from '../banner/banner.model';
import { InvestOrExpensesModel } from './investOrExpence.model';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';

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
    const findInvestment = await InvestOrExpensesModel.findOne({
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

const calclutionForExpences = async (
  amountSpent: number,
  session?: mongoose.ClientSession,
) => {
  
  const bannerData = session
    ? await BannerMOdel.findOne({}).session(session) 
    : await BannerMOdel.findOne({}); 
  if (!bannerData) {
    throw new Error("Banner data not found");
  }
  const expensePerHead = amountSpent / bannerData.totalNumberOfShare;

  const allMemberShareDetail =session? await ShareDetailModel.find().session(session)
  :await ShareDetailModel.find()

  const updateShareDetailArr = allMemberShareDetail.map((eachShareDetail)=>{
    console.log("each share detail arr",eachShareDetail)
  })


};

export const investmentUtillFunctions = {
  expenceBeyondTotalCurrentBalanceCheck,
  checkIfInvestment,
  calcluateOfAsingleInstallment,
  calclutionForExpences,
};
