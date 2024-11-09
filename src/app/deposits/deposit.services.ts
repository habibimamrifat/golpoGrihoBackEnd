import { TDeposit } from './deposit.interface';
import { DepositListtModel } from './deposit.model';
import dublicetDepositCheck from './dublicetDeposit.utill';

const createDeposit = async (depositData: TDeposit) => {
  const result = await DepositListtModel.create(depositData);
  return result;
};
const makeADeposit = async (depositData: any) => {
  const { id, deposit } = depositData;

  const dublicateDepositCheck = await dublicetDepositCheck(id, deposit);
  if (!dublicateDepositCheck) {
    const result = await DepositListtModel.findOneAndUpdate(
      { id: id },
      { $push: { depositList: deposit } },
      { new: true },
    );
    return result;
  }
};
export const depositServices = {
  createDeposit,
  makeADeposit,
};
