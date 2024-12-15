import mongoose from 'mongoose';
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { BannerServeces } from '../banner/banner.servicces';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { UserModel } from '../user/user.model';
import { sendEmail } from '../../utility/sendEmail';

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
      { $match: { id: id } },
      { $unwind: '$installmentList' },
      {
        $match: {
          'installmentList._id': new mongoose.Types.ObjectId(
            installmentStatus.installmentList_id,
          ),
        },
      },
    ]).session(session);

    console.log(installmentData[0].installmentList.status);

    // const incrementAmmount = installmentData ? installmentData.installmentAmount : 0

    if (installmentData[0].installmentList.status === 'waiting') {
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

      const totalDepositAndInstallmetCounnt =
        await calculateTotalInstallment(id);

      // console.log('the data', totalDepositAndInstallmetCounnt);

      const updateInstallmets = await InstallmentListtModel.updateOne(
        { id: id },
        {
          $set: { totalDeposit: totalDepositAndInstallmetCounnt.totalDeposit },
        },
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
            grossPersonalBalance:
              installmentData[0].installmentList.installmentAmount,
          },
        },
        { new: true, session },
      );

      await BannerServeces.updateBannerTotalDepositAmount(session);
      await BannerServeces.updateBannerGrossTotalBalance(session);

      await session.commitTransaction();

      // console.log("from service",updateShareDetail)

      // send member a email that his or her innstallment has been accepted down

      const user = await UserModel.findOne({ id: id });
      if (user) {
        // find installment after being updated
        const findUpdatedInstallment = await InstallmentListtModel.findOne({
          id: id,
          'installmentList._id': new mongoose.Types.ObjectId(
            installmentStatus.installmentList_id,
          ),
        });

        // now turn that updated installment into a readable text
          const messageConversition =  `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Thank You For Contribution</h2>
            <h3>Installment Detail:</h3>
            <p><strong>Member ID:</strong> ${user.id}</p>
            <p><strong>Installment Amount:</strong> ${findUpdatedInstallment?.installmentList[0].installmentAmount}</p>
            <p><strong>Installment For:</strong> ${findUpdatedInstallment?.installmentList[0].numberOfMonth} month</p>
            <p><strong>Installment Status:</strong> ${findUpdatedInstallment?.installmentList[0].status}</p>
            <p><strong>Installment Year:</strong> ${findUpdatedInstallment?.installmentList[0].year}</p>
            <p><strong>Installment Month:</strong> ${findUpdatedInstallment?.installmentList[0].month}</p>
            <p><strong>Accepted By:</strong> ${findUpdatedInstallment?.installmentList[0].acceptedBy}</p>
          </div>`

          // console.log('messageConversition', messageConversition);

          await sendEmail(user.email,`Installment ${installmentStatus.status}`,messageConversition)
        }
      // send member a email that his or her innstallment has been accepted up

      return {
        updateShareDetail,
        message: 'installment Accepted and Email Sent to Member',
      };
    } else {
      throw Error(
        `cant be ${installmentStatus.status} same request which is already been ${installmentData[0].installmentList.status}`,
      );
    }
  } catch (err: any) {
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
