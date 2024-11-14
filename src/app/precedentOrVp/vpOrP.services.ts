import mongoose from 'mongoose';
import { InstallmentListtModel } from '../innstallmennt/installment.model';

const findAllWaitingInstallment = async () => {
  const result = await InstallmentListtModel.aggregate([
    { $unwind: '$depositList' },
    { $match: { 'depositList.status': 'waiting' } },
  ]).project({ id: 1, depositList: 1 });
  //   console.log('waiting', allWautingInstallment);
  return result;
};

const approveOrDeclineAnInstallment = async (
  VpOrPId: string,
  id: string,
  installmentStatus: { status: string; _id: string },
) => {
 const calclulateTotalInstallment = async (id:string)=>{
    const updateTotalInstallment = await InstallmentListtModel.aggregate([{$match:{id:id}},{$unwind:'$depositList'}])
    return updateTotalInstallment
 }
  const update = await InstallmentListtModel.aggregate([
    { $match: { id: id } },
    { $unwind: '$depositList' },
    {$match:{"depositList._id":new mongoose.Types.ObjectId(installmentStatus._id)}},
    {$set:{"depositList.status":installmentStatus.status}}
  ]);
   const result = await calclulateTotalInstallment(id)
  console.log(result)
};

export const vpOrPServices = {
  findAllWaitingInstallment,
  approveOrDeclineAnInstallment,
};
