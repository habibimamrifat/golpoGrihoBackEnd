import mongoose from 'mongoose';
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { BannerServeces } from '../banner/banner.servicces';

const findAllWaitingInstallment = async () => {
  const result = await InstallmentListtModel.aggregate([
    { $unwind: '$installmentList' },
    { $match: { 'installmentList.status': 'waiting' } },
    {
      $lookup: {
        from: 'members',
        localField: 'id',
        foreignField: 'id',
        as: 'memberDetails',
      },
    },
  ]).project({ id: 1, installmentList: 1, 'memberDetails.name': 1 });
  return result;
};

const approveOrDeclineAnInstallment = async (
  VpOrPId: string,
  id: string,
  installmentStatus: { status: string; _id: string },
) => {
  const updateStatus = await InstallmentListtModel.updateOne(
    {
      id: id,
      'installmentList._id': new mongoose.Types.ObjectId(installmentStatus._id),
    },
    {
      $set: {
        'installmentList.$.status': installmentStatus.status,
        acceptedBy: VpOrPId,
      },
    },
  );

  const calculateTotalInstallment = async (id: string) => {
    const totalInstallment = await InstallmentListtModel.aggregate([
      { $match: { id: id } },
      { $unwind: '$installmentList' },
      { $match: { 'installmentList.status': 'approved' } },
      {
        $group: {
          _id: null,
          totalDeposit: { $sum: '$installmentList.installmentAmount' },
        },
      },
    ]);

    return totalInstallment.length > 0 ? totalInstallment[0].totalDeposit : 0;
  };

  const totalDeposit = await calculateTotalInstallment(id);

  await InstallmentListtModel.updateOne(
    { id: id },
    { $set: { totalDeposit: totalDeposit } },
  );
  
  await BannerServeces.updateBannerTotalDepositAmount();
};

export const vpOrPServices = {
  findAllWaitingInstallment,
  approveOrDeclineAnInstallment,
};
