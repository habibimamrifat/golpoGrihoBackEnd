import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';

import { adminServeces } from './admin.services';

const findAllMember = asyncCatch(async (req, res) => {
  const result = await adminServeces.findAllMember();
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'all member found',
    data: result,
  });
});

const findAllMemberRequests = asyncCatch(async (req, res) => {
  const result = await adminServeces.findAllMemberRequests();
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'all member request found',
    data: result,
  });
});

const findPrecedentAndVp = asyncCatch(async (req, res) => {
  const result = await adminServeces.findPrecedentAndVp();
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'all member request found',
    data: result,
  });
});

const acceptOrCacelmemberRequest = asyncCatch(async (req, res) => {
  const { id, requestState } = req.body;
  // console.log(req.body)

  const result = await adminServeces.acceptOrCacelmemberRequest(
    id,
    requestState,
  );
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'members requestState has ben updated',
    data: result,
  });
});

const makePrecidentOrVp = asyncCatch(async (req, res) => {
  const { id, role } = req.body;
  // console.log(req.body)

  const result = await adminServeces.makePrecidentOrVp(id, role);
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'members role has ben updated',
    data: result,
  });
});
const updateAccuiredNumberOfShareOfAMember = asyncCatch(async (req, res) => {
  const { memberId, numberOfShares } = req.body;
  // console.log(req.body)

  const result = await adminServeces.updateAccuiredNumberOfShareOfAMember(
    memberId,
    numberOfShares,
  );
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'members role has ben updated',
    data: result,
  });
});

const removePresedentOrVpRole = asyncCatch(async (req, res) => {
  const { VpOrPId } = req.params;
  console.log(VpOrPId);

  const result = await adminServeces.removePresedentOrVpRole(VpOrPId);
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'members role has ben updated',
    data: result,
  });
});

const updateValueOfEachShare = asyncCatch(async (req, res) => {
  const { valueOfEachShare } = req.params;
  console.log(valueOfEachShare);

  const result = await adminServeces.updateValueOfEachShare(valueOfEachShare);
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'value Of Each Share has ben updated',
    data: result,
  });
});

const deleteMember = asyncCatch(async (req, res) => {
  const { memberId } = req.params;
  console.log(memberId);

  const result = await adminServeces.deleteMember(memberId);
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'members role has ben updated',
    data: result,
  });
});

export const adminConntroller = {
  findAllMember,
  findAllMemberRequests,
  acceptOrCacelmemberRequest,
  makePrecidentOrVp,
  findPrecedentAndVp,
  removePresedentOrVpRole,
  deleteMember,
  updateAccuiredNumberOfShareOfAMember,
  updateValueOfEachShare
};
