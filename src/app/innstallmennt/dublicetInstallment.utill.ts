import { TInstallment } from './installment.interface';
import { InstallmentListtModel } from './installment.model';

const dublicetDepositCheck = async (id: string, deposit: TInstallment) => {
  const dublicateFound = await InstallmentListtModel.aggregate([
    { $match: { id: id } },
    { $unwind: '$depositList' },
    {
      $match: {
        'depositList.year': deposit.year,
        'depositList.month': deposit.month,
      },
    },
  ]);
  if (dublicateFound.length > 0) {
    throw Error('Installment for this month is already provided');
  } else {
    return undefined;
  }
};
export default dublicetDepositCheck;
