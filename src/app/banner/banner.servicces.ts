import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { UserModel } from '../user/user.model';
import { BannerMOdel } from './banner.model';

const createBanner = async () => {
  try {
    const findBanner = await BannerMOdel.find();
    if (findBanner.length === 0) {
      return await BannerMOdel.create({
        totalDepositedAmmount: 0,
        totalMember: 0,
      });
    }
    return findBanner[0];
  } catch (err) {
    console.error('Something went wrong during creating banner:', err);
    throw err;
  }
};

const updateBannerTotalMember = async () => {
  try {
    const totalmember = await UserModel.find({
      requestState: 'approved',
      isDelited: false,
    });
    const updateBannerTotalMember = await BannerMOdel.findOneAndUpdate(
      {},
      { totalMember: totalmember.length },
      { new: true },
    );
  } catch (err) {
    console.log('something went wront in updateBannerTotalMember ');
  }
};

const updateBannerTotalDepositAmount = async () => {
  try {
    const totalAmount = await InstallmentListtModel.aggregate([
      {
        $group: {
          _id: null,
          totalDeposit: { $sum: '$totalDeposit' },
        },
      },
    ]);

    const total = totalAmount.length > 0 ? totalAmount[0].totalDeposit : 0;

    const updateTotalDepositedAmmount = await BannerMOdel.findOneAndUpdate({},{totalDepositedAmmount:total})

    return total;
  } catch (err) {
    console.error('Error while calculating total deposit amount:', err);
    throw err;
  }
};

export const BannerServeces = {
  createBanner,
  updateBannerTotalMember,
  updateBannerTotalDepositAmount
};
