import { TInstallment } from './installment.interface';
import { InstallmentListtModel } from './installment.model';
import dublicetDepositCheck from './dublicetInstallment.utill';

const createInstallmentList = async (depositData: TInstallment) => {
  const result = await InstallmentListtModel.create(depositData);
  return result;
};

const makeAInstallment = async (depositData: any) => {
  const { id, deposit } = depositData;

  const dublicateDepositCheck = await dublicetDepositCheck(id, deposit);
  if (!dublicateDepositCheck) {
    const result = await InstallmentListtModel.findOneAndUpdate(
      { id: id },
      { $push: { depositList: deposit } },
      { new: true },
    );
   if(result)
   {
    return result;
   }
   else{
    throw new Error("Something Went Wrong")
   }
  }
};

const findInstallmentOfAllMembers = async () => {
  const result = await InstallmentListtModel.find();
  return result;
};

const findInstallmentOfSingleMember = async (id: string) => {
  const result = await InstallmentListtModel.findOne({ id: id });
  return result;
};

export const InstallmentServices = {
  createInstallmentList,
  makeAInstallment,
  findInstallmentOfSingleMember,
  findInstallmentOfAllMembers,
};
