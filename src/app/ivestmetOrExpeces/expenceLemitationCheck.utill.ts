import mongoose, { ClientSession } from 'mongoose';
import { BannerMOdel } from '../banner/banner.model';
import { InvestOrExpensesModel } from './investOrExpence.model';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { BannerServeces } from '../banner/banner.servicces';
import {
  TContributionDetail,
  TIvestmentCycleIput,
} from './investOrExpence.interface';

const findLastexpenceOrInvestment = async () => {
  const lastRegisteredId = await InvestOrExpensesModel.findOne(
    {},
    { id: 1 },
  ).sort({ createdAt: -1 });

  return lastRegisteredId?.id.slice(3) || undefined;
};

const expenceOrInvestmentIdGeneretor = async (pattern: string) => {
  const currentId = (await findLastexpenceOrInvestment()) || (0).toString();
  // console.log("cccc",currentId)

  // Increment and pad the ID
  let convertedId = (Number(currentId) + 1).toString().padStart(4, '0');

  // Construct the final ID
  convertedId = `${pattern}${convertedId}`;

  // console.log(convertedId);
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

const checkIsDisCOntinued = async (id: string, session?: ClientSession) => {
  const isDiscontinued = session
    ? await InvestOrExpensesModel.findOne({
        id: id,
        isDiscontinued: true,
      }).session(session)
    : await InvestOrExpensesModel.findOne({
        id: id,
        isDiscontinued: true,
      });

  // if (isDiscontinued) {
  //   console.log('this Investment Is Discontinued');
  //   throw Error('this Investment Is Discontinued');
  // }

  return isDiscontinued;
};

const updateInvestmentCycle = async (
  payload: TIvestmentCycleIput,
  session?: ClientSession,
) => {
  const { id } = payload;
  const updateInvestmentCycle = session
    ? await InvestOrExpensesModel.findOneAndUpdate(
        { id: id },
        { $push: { investmentCycle: payload } },
        { new: true, session },
      )
    : await InvestOrExpensesModel.findOneAndUpdate(
        { id: id },
        { $push: { investmentCycle: payload } },
        { new: true },
      );

  if (!updateInvestmentCycle) {
    console.log('couldent uppdate Investment cycle');
    throw Error('couldent uppdate Investment cycle');
  }

  return updateInvestmentCycle;
};

const analisisInvestmentTransactionList = async (
  payload: TIvestmentCycleIput,
  session?: ClientSession,
) => {
  const { id } = payload;
  const aggregate = [
    { $match: { id: id } },
    { $unwind: '$investmentCycle' },
    {
      $group: {
        _id: '$investmentCycle.cycleType',
        total: { $sum: '$investmentCycle.amount' },
      },
    },
  ];

  const analisisExpences = session
    ? await InvestOrExpensesModel.aggregate(aggregate).session(session)
    : await InvestOrExpensesModel.aggregate(aggregate);

  // console.log(analisisExpences);

  if (!analisisExpences) {
    console.log('analisisExpences', analisisExpences);
    throw Error('coudnt find analisisExpences');
  }

  let investmentTotal = 0;
  let reInvestTotal = 0;
  let investmentReturnTotal = 0;

  // Sum up the totals
  analisisExpences.forEach((item) => {
    if (item._id === 'investment') investmentTotal += item.total;
    if (item._id === 'reInvest') reInvestTotal += item.total;
    if (item._id === 'investmentReturn') investmentReturnTotal += item.total;
  });
  return {
    investmentTotal: investmentTotal,
    reInvestTotal: reInvestTotal,
    investmentReturnTotal: investmentReturnTotal,
  };
};

const updateGrossOutcomeOfaInvestment = async (
  id: string,
  netOutcome: number,
  ammountSpent: number,
  session?: ClientSession,
) => {
  const updateOption =
    netOutcome >= 0
      ? {
          ammountSpent: ammountSpent,
          profitGenareted: netOutcome,
          madeLoss: 0,
        }
      : {
          ammountSpent: ammountSpent,
          profitGenareted: 0,
          madeLoss: netOutcome,
        };

  const updateGrossOutcomeOfaTransaction = session
    ? await InvestOrExpensesModel.findOneAndUpdate({ id: id }, updateOption, {
        new: true,
        session,
      })
    : await InvestOrExpensesModel.findOneAndUpdate({ id: id }, updateOption, {
        new: true,
      });

  if (!updateGrossOutcomeOfaTransaction) {
    console.log('couldnt exacute updateGrossOutcomeOfaTransaction');
    throw Error('couldnt exacute updateGrossOutcomeOfaTransaction');
  }
  return updateGrossOutcomeOfaTransaction;
};

const findDistrubutionOfSharesOfAnInvestMent = async (
  investOrExpenceId: string,
) => {
  const query = [
    {
      $match: { id: investOrExpenceId }, // Match the document with the specified ID
    },

    {
      $facet: {
        totalShares: [
          {
            $unwind: '$destrubutionOfShares', // Deconstruct the destrubutionOfShares array
          },
          {
            $group: {
              _id: null, // Grouping all documents into a single group
              totalNumberOfShare: {
                $sum: '$destrubutionOfShares.numberOfShareOwned', // Sum up the numberOfShareOwned field
              },
            },
          },
        ],
        destrubutionOfSharesArray: [
          {
            $project: {
              destrubutionOfShares: 1, // Project only the destrubutionOfShares array
            },
          },
        ],
      },
    },

    {
      $project: {
        totalNumberOfShare: {
          $arrayElemAt: ['$totalShares.totalNumberOfShare', 0],
        },
        destrubutionOfShares: {
          $arrayElemAt: ['$destrubutionOfSharesArray.destrubutionOfShares', 0],
        },
      },
    },
  ];

  const getDestubutionOfShareOfAnInvestmentOrExpences =
    await InvestOrExpensesModel.aggregate(query);

  // console.log(
  //   'from findDistrubutionOfSharesOfAnInvestMent',
  //   getDestubutionOfShareOfAnInvestmentOrExpences,
  // );

  return getDestubutionOfShareOfAnInvestmentOrExpences;
};

const updateContributionListForInvestmentOrExpance = async (
  investOrExpenceId: string,
  amount: number,
  nature: 'profit' | 'loss' | 'investment' | 'expence',
  session?: ClientSession,
) => {
  let totalNumberOfSharesCombind = 0;
  let destrubutionOfSharesList: Array<any> = [];

  // Fetch distribution of shares
  const findDistrubutionOfShares = await findDistrubutionOfSharesOfAnInvestMent(investOrExpenceId);
  if (!findDistrubutionOfShares || !findDistrubutionOfShares.length) {
    throw new Error("Distribution of shares not found for the given investment/expense ID");
  }

  totalNumberOfSharesCombind = findDistrubutionOfShares[0]?.totalNumberOfShare ?? 0;
  destrubutionOfSharesList = findDistrubutionOfShares[0]?.destrubutionOfShares ?? [];

  if (totalNumberOfSharesCombind === 0 || destrubutionOfSharesList.length === 0) {
    throw new Error("Invalid distribution data: no shares or share distribution found");
  }

  // Calculate expense per head
  const expensePerHead = amount / totalNumberOfSharesCombind;

  // Fetch all member share details
  const allMemberShareDetail = session
    ? await ShareDetailModel.find({isDelited:false}).session(session)
    : await ShareDetailModel.find({isDelited:false});

  if (!allMemberShareDetail || allMemberShareDetail.length === 0) {
    throw new Error("No member share details found");
  }

  // Construct the updated contribution list
  const updatedContributionList: TContributionDetail[] = allMemberShareDetail.map((eachMemberShareDetail) => {

    const findAccuriedShare = destrubutionOfSharesList.find(
      (item: any) => item.id === eachMemberShareDetail.id,
    );

    if (!findAccuriedShare) {
      throw new Error(`No matching share found for member ID: ${eachMemberShareDetail.id}`);
    }

    const contribution = expensePerHead * findAccuriedShare.numberOfShareOwned;
    // console.log("here i am ",findAccuriedShare.numberOfShareOwned)
    return {
      id: eachMemberShareDetail.id,
      accuriedShare: findAccuriedShare.numberOfShareOwned,
      contribution: contribution,
      contributionType: nature,
    };

  });

  // Update the contribution list in the database
  const updateContributionListInDb = session
    ? await InvestOrExpensesModel.findOneAndUpdate(
        { id: investOrExpenceId }, // Query
        { $set: { contributionList: updatedContributionList } }, // Update
        { new: true, session }, // Options
      )
    : await InvestOrExpensesModel.findOneAndUpdate(
        { id: investOrExpenceId }, // Query
        { $set: { contributionList: updatedContributionList } }, // Update
        { new: true }, // Options
      );

  if (!updateContributionListInDb) {
    throw new Error("Failed to update contribution list in the database");
  }

  // console.log("yoo yoo",updateContributionListInDb)

  return true;
};


const calclutionForGrossReductionOrAddition = async (
  investOrExpenceId: string,
  amount: number,
  nature: 'reduction' | 'addition',
  session?: mongoose.ClientSession,
) => {
  try {
    const findDistrubutionOfShares = await findDistrubutionOfSharesOfAnInvestMent(investOrExpenceId);

    if (!findDistrubutionOfShares || !findDistrubutionOfShares.length) {
      throw new Error("Distribution of shares not found for the given investment/expense ID");
    }

    const totalNumberOfShare = findDistrubutionOfShares[0]?.totalNumberOfShare;
    const destrubutionOfShares = findDistrubutionOfShares[0]?.destrubutionOfShares;

    if (!totalNumberOfShare || !destrubutionOfShares || destrubutionOfShares.length === 0) {
      throw new Error("Invalid distribution data: no total shares or share distribution found");
    }

    const expensePerHead = amount / totalNumberOfShare;

    const allMemberShareDetail = session
      ? await ShareDetailModel.find({isDelited:false}).session(session)
      : await ShareDetailModel.find({isDelited:false});

    if (!allMemberShareDetail || allMemberShareDetail.length === 0) {
      throw new Error("No member share details found");
    }

    const updateArr = allMemberShareDetail.map((eachShareDetail) => {
      const findAccuriedShare = destrubutionOfShares.find(
        (item: any) => item.id === eachShareDetail.id,
      );

      if (!findAccuriedShare) {
        throw new Error(`No matching share found for member ID: ${eachShareDetail.id}`);
      }

      const contribution = expensePerHead * findAccuriedShare.numberOfShareOwned;
      let grossPersonalBalanceUpdated = nature === 'reduction'
        ? eachShareDetail.grossPersonalBalance - contribution
        : eachShareDetail.grossPersonalBalance + contribution;

      const totalPersonalProfitUpdated =
        grossPersonalBalanceUpdated - eachShareDetail.totalPersonalIstallmetAmmout;

      const stateUpdated =
        grossPersonalBalanceUpdated < eachShareDetail.totalPersonalIstallmetAmmout
          ? 'In Loss'
          : grossPersonalBalanceUpdated > eachShareDetail.totalPersonalIstallmetAmmout
          ? 'In Profit'
          : 'Neutral';

      const inDebtUpdate = grossPersonalBalanceUpdated < 0;
      const debtAmountUpdate = inDebtUpdate ? Math.abs(totalPersonalProfitUpdated) : 0;

      return {
        id: eachShareDetail.id,
        grossPersonalBalanceUpdated,
        totalPersonalProfitUpdated,
        stateUpdated,
        inDebtUpdate,
        debtAmountUpdate,
      };
    });

    const updateMembersGrossPersonalBalance = updateArr.map((eachUpdate) => {
      const updateOptions = session ? { new: true, session } : { new: true };
      return ShareDetailModel.findOneAndUpdate(
        { id: eachUpdate.id },
        {
          grossPersonalBalance: eachUpdate.grossPersonalBalanceUpdated,
          totalPersonalProfit: eachUpdate.totalPersonalProfitUpdated,
          state: eachUpdate.stateUpdated,
          inDebt: eachUpdate.inDebtUpdate,
          debtAmount: eachUpdate.debtAmountUpdate,
        },
        updateOptions,
      );
    });

    // Wait for all updates to complete
    const result = await Promise.all(updateMembersGrossPersonalBalance);

    // Update banner gross total balance
    if (session) {
      await BannerServeces.updateBannerGrossTotalBalance(session);
    } else {
      await BannerServeces.updateBannerGrossTotalBalance();
    }

    return result;
  } catch (err: any) {
    console.error("Error occurred in calclutionForGrossReductionOrAddition:", err.message);
    throw new Error(err.message || "Error occurred during gross reduction or addition calculation");
  }
};


export const investmentUtillFunctions = {
  expenceOrInvestmentIdGeneretor,
  expenceBeyondTotalCurrentBalanceCheck,
  checkIfInvestment,
  updateGrossOutcomeOfaInvestment,
  calclutionForGrossReductionOrAddition,
  checkIsDisCOntinued,
  updateInvestmentCycle,
  analisisInvestmentTransactionList,
  updateContributionListForInvestmentOrExpance,
};
