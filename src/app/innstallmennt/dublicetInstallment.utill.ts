import { BannerMOdel } from '../banner/banner.model';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { TInstallment } from './installment.interface';
import { InstallmentListtModel } from './installment.model';

const dublicetDepositCheck = async (id: string, deposit: TInstallment) => {
  const dublicateFound = await InstallmentListtModel.aggregate([
    { $match: { id: id } },
    { $unwind: '$installmentList' },
    {
      $match: {
        'installmentList.year': deposit.year,
        'installmentList.month': deposit.month,
      },
    },
  ]);
  if (dublicateFound.length > 0) {
    throw Error('Installment for this month is already provided');
  } else {
    return undefined;
  }
};

const installmentLOwerLimitCheck = async (
  memberId: string,
  incommingAmmount: number,
  numberOfMonth:number
) => {
  console.log('from check', incommingAmmount);

  const installmentLowerLimit = await BannerMOdel.findOne();
  if (installmentLowerLimit) {
    if (installmentLowerLimit.valueOfEachShare > incommingAmmount) {
      throw Error('Installment lowerLimit is not satisfied');
    } else {
      const numberOfAccuredShare = await ShareDetailModel.findOne({
        id: memberId,
      });
      if (numberOfAccuredShare) {
        const isInstallmentLowerLimitAccordingToShare =
          installmentLowerLimit.valueOfEachShare *
          numberOfAccuredShare?.numberOfShareWonedPersonally*numberOfMonth;

        if (isInstallmentLowerLimitAccordingToShare <= incommingAmmount) 
        {
          const isRound =
            incommingAmmount % installmentLowerLimit.valueOfEachShare === 0;
          if (isRound) {
            return true;
          } else {
            throw Error(
              'the istallment ammount can not be devided in round number off month. please check your input or cotact admin',
            );
          }
        }
        else
        {
          throw Error(`you are trying to pass installment Which is low. according to your accured shareit should me minimum ${isInstallmentLowerLimitAccordingToShare}`)
        }
      }
    }
  }
};

export const installmetUtill = {
  dublicetDepositCheck,
  installmentLOwerLimitCheck,
};
