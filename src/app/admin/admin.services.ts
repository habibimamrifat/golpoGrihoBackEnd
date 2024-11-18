import memberModel from '../members/member.model';
import { TUser } from '../user/user.interface';
import { TMember } from '../members/member.interface';
import { UserModel } from '../user/user.model';
import { adminUtill } from './admin.utill';
import mongoose from 'mongoose';
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { BannerServeces } from '../banner/banner.servicces';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { BannerMOdel } from '../banner/banner.model';

const findAllMember = async () => {
  const allMambers = await memberModel
    .find()
    .populate('installmentList')
    .populate('user')
    .lean();

  let result: TMember[] = [];

  allMambers.forEach((eachMember) => {
    const user = eachMember.user as TUser;
    if (user && user.requestState === 'approved') {
      result.push(eachMember);
    }
  });
  return result;
};

const findAllMemberRequests = async () => {
  let result: TMember[] = [];
  const requestingUser = await UserModel.find({ requestState: 'waiting' });
  const requestedUserPromise = requestingUser.map(async (user) => {
    const member = await memberModel.findOne({ id: user.id }).populate('user');
    // console.log(member)

    if (member === null) {
      throw new Error('No Member request');
    } else {
      return member as TMember;
    }
  });

  const requestedMembers = await Promise.all(requestedUserPromise);

  //   console.log("result",requestedMembers)
  result.push(...requestedMembers);
  return result;
};

const findPrecedentAndVp = async () => {
  let result: TMember[] = [];
  const users = await UserModel.find({
    role: { $in: ['precident', 'vicePrecident'] },
  });
  const presedentOrVpDataPromise = users.map(async (user) => {
    const memberData = await memberModel
      .findOne({ id: user.id })
      .populate('user');
    if (memberData === null) {
      throw new Error('No Member request');
    } else {
      return memberData as TMember;
    }
  });

  const presedentOrVpData = await Promise.all(presedentOrVpDataPromise);
  result.push(...presedentOrVpData);
  return result;
};

const acceptOrCacelmemberRequest = async (id: string, requestState: string) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const result = await UserModel.findOneAndUpdate(
      { id: id },
      { requestState: requestState },
      { new: true ,session},
    );
    if(!result)
    {
      throw Error("member not found")
    }

    await BannerServeces.updateBannerTotalMember(session)
    await BannerServeces.updateTotalumberOfShare(session)

    await session. commitTransaction()

    return result
  } 
  catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw Error('something wennt wrong');
  }
};

const makePrecidentOrVp = async (id: string, role: string) => {
  const Isfound = await adminUtill.rollCheck(role);
  if (Isfound) {
    throw new Error(
      `There is already a ${role} , please remove ${role} to make new ${role}`,
    );
  } else {
    const result = await UserModel.findOneAndUpdate(
      { id: id },
      { role: role },
      { new: true },
    );
    return result;
  }
};

const updateAccuiredNumberOfShareOfAMember = async (
  id: string,
  numberOfShares: string,
) => {
  const result = await ShareDetailModel.findOneAndUpdate(
    { id: id },
    { numberOfShareWonedPersonally: numberOfShares },
    { new: true },
  );
  await BannerServeces.updateTotalumberOfShare();
  return result;
};

const removePresedentOrVpRole = async (id: string) => {
  const result = await UserModel.findOneAndUpdate(
    { id: id },
    { role: 'member' },
    { new: true },
  );
  return result;
};

const updateValueOfEachShare = async (valueOfEachShare: string) => {
  const result = await BannerMOdel.updateMany(
    {},
    { valueOfEachShare: valueOfEachShare },
    { new: true },
  );
  return result;
};

const deleteMember = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteUser = await UserModel.findOneAndUpdate(
      { id: id },
      { isDelited: true },
      { new: true, session },
    );
    const deletedMember = await memberModel.findOneAndUpdate(
      { id: id },
      { isDelited: true },
      { new: true, session },
    );
    const deletedIstallmet = await InstallmentListtModel.findOneAndUpdate(
      { id: id },
      { isDelited: true },
      { new: true, session },
    );
    const deleteShareDetail = await ShareDetailModel.findOneAndUpdate(
      { id: id },
      { isDelited: true },
      { new: true, session },
    );
    await session.commitTransaction();

    await BannerServeces.updateBannerTotalMember();

    return {
      message: 'Member and related data successfully marked as deleted',
      success: true,
    };
  } catch (err) {
    console.log(err);
    session.abortTransaction();
  } finally {
    session.endSession();
  }
};

export const adminServeces = {
  findAllMember,
  findAllMemberRequests,
  acceptOrCacelmemberRequest,
  makePrecidentOrVp,
  findPrecedentAndVp,
  removePresedentOrVpRole,
  deleteMember,
  updateAccuiredNumberOfShareOfAMember,
  updateValueOfEachShare,
};
