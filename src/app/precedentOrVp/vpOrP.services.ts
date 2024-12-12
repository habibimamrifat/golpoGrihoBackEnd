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

    const installmentData = await InstallmentListtModel.aggregate([
      {$match:{id:id}},
      {$unwind:"$installmentList"},
      {$match:{"installmentList._id": new mongoose.Types.ObjectId(
        installmentStatus.installmentList_id)}}

    ]).session(session);;

    console.log(installmentData[0].installmentList.status);

    // const incrementAmmount = installmentData ? installmentData.installmentAmount : 0

    if(installmentData[0].installmentList.status === "waiting")
    {
      const updateStatus = await InstallmentListtModel.updateOne(
        {
          id: id,
          'installmentList._id': new mongoose.Types.ObjectId(
            installmentStatus.installmentList_id
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
        ]).session(session);
  
        return totalInstallment.length > 0
          ? {
              totalDeposit: totalInstallment[0].totalDeposit,
              totalNumberOfInstallments:
                totalInstallment[0].totanNumberOfInstallment,
            }
          : {
              totalDeposit: 0,
              totalNumberOfInstallments: 0,
            };
      };
  
      const totalDepositAndInstallmetCounnt = await calculateTotalInstallment(id);
  
      // console.log('the data', totalDepositAndInstallmetCounnt);
  
      const updateInstallmets = await InstallmentListtModel.updateOne(
        { id: id },
        { $set: { totalDeposit: totalDepositAndInstallmetCounnt.totalDeposit } },
        { new: true, session },
      );
  
      const updateShareDetail = await ShareDetailModel.updateOne(
        { id: id },
        {
          $set: {
            totalPersonalIstallmetAmmout:
              totalDepositAndInstallmetCounnt.totalDeposit,
            numberOfPersonalIstallmet:
              totalDepositAndInstallmetCounnt.totalNumberOfInstallments,
          },
          $inc: {
            grossPersonalBalance: installmentData[0].installmentList.installmentAmount,
          },
        },
        { new: true, session },
      );
  
      await BannerServeces.updateBannerTotalDepositAmount(session);
      await BannerServeces.updateBannerGrossTotalBalance(session)
  
      await session.commitTransaction();
  
      return {
        updateShareDetail,
        message: 'installment Accepted',
      };
    }
    else
    {
      throw Error(`cant be ${installmentStatus.status} same request which is already been ${installmentData[0].installmentList.status}`)
    }

  } catch (err:any) {
    await session.abortTransaction();
    throw Error(err.message || 'somethig went wrong');
  } finally {
    await session.endSession();
  }
};

export const vpOrPServices = {
  findAllWaitingInstallment,
  approveOrDeclineAnInstallment,
};
