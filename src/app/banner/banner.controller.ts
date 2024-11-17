import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';
import { BannerServeces } from './banner.servicces';

const getBanner = asyncCatch(async (req, res) => {
  const result = await BannerServeces.getBanner();
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'BANNER FOUND',
    data: result,
  });
});

export const bannerController = {
  getBanner,
};
