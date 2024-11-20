import mongoose from 'mongoose';
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { UserModel } from '../user/user.model';
import { BannerMOdel } from './banner.model';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { query } from 'express';
import { InvestOrExpensesModel } from '../ivestmetOrExpeces/investOrExpence.model';

const updateBannerTotalMember = async (session?: mongoose.ClientSession) => {
  try {
    // Define the query
    const query = {
      requestState: 'approved',
      isDelited: false,
    };

    // Execute the query with or without the session
    const totalMembers = session
      ? await UserModel.find(query).session(session)
      : await UserModel.find(query);

    // Execute the update with or without the session
    const updateOptions = session ? { session, new: true } : { new: true };
    const updatedBanner = await BannerMOdel.findOneAndUpdate(
      {},
      { totalMember: totalMembers.length },
      updateOptions,
    );

    return updatedBanner;
  } catch (err) {
    console.error('Something went wrong in updateBannerTotalMember:', err);
    throw err;
  }
};

const updateBannerTotalumberOfShare = async (
  session?: mongoose.ClientSession,
) => {
  const query = {
    $group: {
      _id: null,
      totalNumberOfShares: { $sum: '$numberOfShareWonedPersonally' },
    },
  };

  try {
    const totalNumberOfShare = session
      ? await ShareDetailModel.aggregate([query]).session(session)
      : await ShareDetailModel.aggregate([query]);

    const updateOptions = session ? { new: true, session } : { new: true };

    const updateBannerQuery = await BannerMOdel.updateOne(
      {},
      { totalNumberOfShare: totalNumberOfShare[0]?.totalNumberOfShares || 0 },
      updateOptions,
    );
    return updateBannerQuery;
  } catch (err) {
    console.log(err);
  }
};

const updateBannerTotalNumberOfInvestment = async (
  session?: mongoose.ClientSession,
) => {
  try {
    const findAllInvestment = session
      ? await InvestOrExpensesModel.find({
          ExpencesType: 'investment',
        }).session(session)
      : await InvestOrExpensesModel.find({ ExpencesType: 'investment' });

    if (!findAllInvestment) {
      throw Error('total number of Investmtent couldent be processed');
    }
    // console.log("i ammmmm",findAllInvestment.length)
    const updateOption = session ? { new: true, session } : { new: true };
    const updateTotalNumberOfInvestment = await BannerMOdel.updateOne(
      {},
      {
        totalNumberOfInvestment: findAllInvestment.length,
      },
      updateOption,
    );
    return updateTotalNumberOfInvestment
  } catch (err: any) {
    console.log('something went wrong in updateBannerTotalNumberOfInvestment');
    throw Error(
      err.message ||
        'something went wrong in updateBannerTotalNumberOfInvestment',
    );
  }
};

const updateBannerTotalDepositAmount = async (
  session?: mongoose.ClientSession,
) => {
  try {
    const aggregationPipeline = [
      {
        $group: {
          _id: null,
          totalDeposit: { $sum: '$totalDeposit' },
        },
      },
    ];

    // Execute the aggregation with or without session
    const totalAmount = session
      ? await InstallmentListtModel.aggregate(aggregationPipeline).session(
          session,
        )
      : await InstallmentListtModel.aggregate(aggregationPipeline);

    const total = totalAmount.length > 0 ? totalAmount[0].totalDeposit : 0;

    // Execute the update with or without session
    const updateOptions = session ? { session } : {};
    const updateTotalDepositedAmmount = await BannerMOdel.findOneAndUpdate(
      {},
      { totalDepositedAmmount: total },
      updateOptions,
    );

    return total;
  } catch (err) {
    console.error('Error while calculating total deposit amount:', err);
    throw err;
  }
};

const updateBannerGrossTotalBalance = async (
  session?: mongoose.ClientSession,
) => {
  try {
    const query = {
      $group: {
        _id: null,
        sumOfAllGrossPersonalBalance: { $sum: '$grossPersonalBalance' },
      },
    };
    const grossToTalBalance = session
      ? await ShareDetailModel.aggregate([query]).session(session)
      : await ShareDetailModel.aggregate([query]);
    // console.log('yooo i ammm', grossToTalBalance);

    const updateOption = session ? { new: true, session } : { new: true };
    const updateGrossTotalBalanceOfBanner = await BannerMOdel.updateOne(
      {},
      {
        grossTotalBalance:
          grossToTalBalance[0].sumOfAllGrossPersonalBalance || 0,
      },
      updateOption,
    );

    // return updateGrossTotalBalanceOfBanner;
  } catch (err) {
    console.log('got problem in updateBannerGrossTotalBalance', err);
    throw Error('got problem in updateBannerGrossTotalBalance');
  }
};

//always  keep it in the end
const createBanner = async () => {
  try {
    const findBanner = await BannerMOdel.find();

    if (findBanner.length === 0) {
      return Promise.all([
        BannerMOdel.create({
          totalDepositedAmmount: 0,
          totalMember: 0,
        }),
        updateBannerTotalMember(),
        updateBannerTotalDepositAmount(),
        updateBannerTotalumberOfShare(),
        updateBannerGrossTotalBalance(),
        updateBannerTotalNumberOfInvestment(),
      ]);
    }

    return Promise.all([
      updateBannerTotalMember(),
      updateBannerTotalDepositAmount(),
      updateBannerTotalumberOfShare(),
      updateBannerGrossTotalBalance(),
      updateBannerTotalNumberOfInvestment(),
    ]);
  } catch (err) {
    console.error('Something went wrong during creating banner:', err);
    throw err;
  }
};

const getBanner = async () => {
  const result = await BannerMOdel.find();
  return result;
};

export const BannerServeces = {
  createBanner,
  updateBannerTotalMember,
  updateBannerTotalDepositAmount,
  updateBannerTotalumberOfShare,
  getBanner,
  updateBannerGrossTotalBalance,
};
