import { TDeposit } from './deposit.interface';
import { DepositListtModel } from './deposit.model';

const dublicetDepositCheck = async (id: string, deposit: TDeposit) => {
  const dublicateFound = await DepositListtModel.aggregate([
    { $match: { id: id } },
    {$unwind:"$depositList"},
    {$match:{"depositList.year":deposit.year, "depositList.month":deposit.month}}
  ]);
  if(dublicateFound.length>0)
  {
    throw Error("Installment for this month is already provided")
  }
  else{
    return undefined;
  }
};
export default dublicetDepositCheck;
