import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';

import { adminServeces } from './admin.services';

const findAllMember = asyncCatch(async (req, res, next) => {
  const result = await adminServeces.findAllMember();
  responseHandeler(res, {
    status:200,
    success:true,
    message: 'all member found',
    data: result,
  });


});

export const adminConntroller = { findAllMember };
