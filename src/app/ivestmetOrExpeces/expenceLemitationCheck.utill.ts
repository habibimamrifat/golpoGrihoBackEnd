import { BannerMOdel } from '../banner/banner.model';

const expenceBeyondTotalCurrentBalanceCheck = async (
  expenceAmmount: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const bannerData = await BannerMOdel.findOne();
    if (bannerData && typeof bannerData.currentTotalBalance === 'number') {
      if (bannerData.currentTotalBalance >= expenceAmmount) {
        return {
          success: true,
          message: 'Expense is within the current balance',
        };
      } else {
        return {
          success: false,
          message: 'The expense is beyond the Current Total Balance',
        };
      }
    } else {
      return {
        success: false,
        message: 'Banner data or currentTotalBalance is missing',
      };
    }
  } catch (err) {
    console.error('Error in expenceBeyondTotalCurrentBalanceCheck:', err);
    return {
      success: false,
      message: 'An unexpected error occurred while checking the balance',
    };
  }
};

export default expenceBeyondTotalCurrentBalanceCheck;
