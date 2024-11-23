import { installmetUtill } from './dublicetInstallment.utill';
import { InstallmentListtModel } from './installment.model';

// const createInstallmentList = async (depositData: TInstallment) => {
//   const result = await InstallmentListtModel.create(depositData);
//   return result;
// };

const makeAInstallment = async (depositData: any) => {
  const { id, deposit } = depositData;

  const satisfyLimit =await installmetUtill.installmentLOwerLimitCheck(id,deposit.installmentAmount,deposit.numberOfMonth);
  if (satisfyLimit) {
    const dublicateDepositCheck = await installmetUtill.dublicetDepositCheck(id,deposit);
    if (!dublicateDepositCheck) {
      const result = await InstallmentListtModel.findOneAndUpdate(
        { id: id },
        { $push: { installmentList: deposit } },
        { new: true },
      );
      if (result) {
        return result;
      } else {
        throw new Error('Something Went Wrong');
      }
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

// createInstallmentList,
export const InstallmentServices = {
  makeAInstallment,
  findInstallmentOfSingleMember,
  findInstallmentOfAllMembers,
};
