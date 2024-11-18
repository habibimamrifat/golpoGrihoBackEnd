import mongoose from 'mongoose';
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { BannerServeces } from '../banner/banner.servicces';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';

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
  installmentStatus: { status: string; installmentList_id: string },
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateStatus = await InstallmentListtModel.updateOne(
      {
        id: id,
        'installmentList._id': new mongoose.Types.ObjectId(
          installmentStatus.installmentList_id,
        ),
      },
      {
        $set: {
          'installmentList.$.status': installmentStatus.status,
          'installmentList.$.acceptedBy': VpOrPId,
        },
      },
      {
        new: true,
        session,
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
            totanNumberOfInstallment: { $sum: 1 },
          },
        },
      ]);

      return totalInstallment.length > 0
        ? {
            totalDeposit: totalInstallment[0].totalDeposit,
            totalNumberOfInstallments: totalInstallment[0].approvedCount,
          }
        : {
            totalDeposit: 0,
            totalNumberOfInstallments: 0,
          };
    };

    const totalDepositAndInstallmetCounnt = await calculateTotalInstallment(id);

    const updateInstallmets = await InstallmentListtModel.updateOne(
      { id: id },
      { $set: { totalDeposit: totalDepositAndInstallmetCounnt.totalDeposit } },
      { new: true, session },
    );

    const updateShareDetail = await ShareDetailModel.updateOne(
      { id: id },
      {
        $set: {
          totalPersonalIstallmetAmmout: totalDepositAndInstallmetCounnt.totalDeposit,
          numberOfPersonalIstallmet: totalDepositAndInstallmetCounnt.totalNumberOfInstallments,
        },
      },
      { new: true, session },
    );

    await BannerServeces.updateBannerTotalDepositAmount();
    await session.commitTransaction();
    return {
      updateShareDetail,
      message:"installment Accepted"
    }
  } catch (err) {
    await session.abortTransaction();
    throw Error('somethig went wrong');
  } finally {
    await session.endSession();
  }
};

export const vpOrPServices = {
  findAllWaitingInstallment,
  approveOrDeclineAnInstallment,
};
