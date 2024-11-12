import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';

import { adminServeces } from './admin.services';

const findAllMember = asyncCatch(async (req, res) => {
  const result = await adminServeces.findAllMember();
  responseHandeler(res, {
    status:200,
    success:true,
    message: 'all member found',
    data: result,
  });


});
const findAllMemberRequests = asyncCatch(async (req, res) => {
  const result = await adminServeces.findAllMemberRequests();
  responseHandeler(res, {
    status:200,
    success:true,
    message: 'all member request found',
    data: result,
  });


});
const acceptOrCacelmemberRequest = asyncCatch(async (req, res) => {
  const {adminId}=req.params
  const result = await adminServeces.acceptOrCacelmemberRequest();
  responseHandeler(res, {
    status:200,
    success:true,
    message: 'all member found',
    data: result,
  });


});

export const adminConntroller = { findAllMember,findAllMemberRequests,acceptOrCacelmemberRequest };
