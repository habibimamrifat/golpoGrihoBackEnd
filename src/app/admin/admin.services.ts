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
import { sendEmail } from '../../utility/sendEmail';
import emailSendBulkOrSingle from '../../utility/emailSendBulkOrSingle';

const findAllMember = async () => {
  const allMambers = await memberModel
    .find()
    .populate('installmentList')
    .populate('user')
    .lean();

  const result: TMember[] = [];

  allMambers.forEach((eachMember) => {
    const user = eachMember.user as TUser;
    if (user && user.requestState === 'approved') {
      result.push(eachMember);
    }
  });
  return result;
};

const findAllMemberRequests = async () => {
  const result: TMember[] = [];
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
  const result: TMember[] = [];
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await UserModel.findOneAndUpdate(
      { id: id },
      { requestState: requestState },
      { new: true, session },
    );
    if (!result) {
      throw Error('member not found');
    }

    await BannerServeces.updateBannerTotalMember(session);
    await BannerServeces.updateBannerTotalumberOfShare(session);

    await session.commitTransaction();

    // send member a email that his or her innstallment has been accepted down

    const user = await UserModel.findOne({ id: id });
    if (user) {
      // now turn that updated installment into a readable text
      const messageConversition = `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome To Golpo Griho Society</h2>
                <h3>Your Detail</h3>
                <p><strong>Your Member ID:</strong> ${user.id}</p>
                <p><strong>Message:</strong>"You are approved to LOG In from now on. Use Email and Password to log in to your account"</p>
              </div>`;

      // console.log('messageConversition', messageConversition);

      await sendEmail(
        user.email,
        `Member Request ${requestState}`,
        messageConversition,
      );
    }
    // send member a email that his or her innstallment has been accepted up

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
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
    // send member a email 

    const user = await UserModel.findOne({ id: id });
    if (user) {
      // now turn that updated installment into a readable text
      const messageConversition = `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Congratulations !</h2>
                <p><strong>Member ID:</strong> ${user.id}</p>
                <h3>You are degignated as ${role}</h3>
                <p><strong>Message:</strong>"With a promise of being Honest annd Transparent your journy as ${role} begins"</p>
              </div>`;

      // console.log('messageConversition', messageConversition);

      await sendEmail(
        user.email,
        `Designation Updated to ${role}`,
        messageConversition,
      );
    }
    // send member a email 
    return result;
  }
};

const updateAccuiredNumberOfShareOfAMember = async (
  id: string,
  numberOfShares: string,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await ShareDetailModel.findOneAndUpdate(
      { id: id },
      { numberOfShareWonedPersonally: numberOfShares },
      { new: true, session },
    );

    if (!result) {
      throw Error('member not founnd');
    }
    await BannerServeces.updateBannerTotalumberOfShare(session);

    await session.commitTransaction();

    const messageConversition = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>ALERT !</h2>
      <h2>Member Id : ${id}</h2>
      <p><strong>Message:</strong>"Now you are owner of ${numberOfShares} shares"</p>
    </div>`;
    const user = await UserModel.findOne({id:id})
    if(user)
    {
      await emailSendBulkOrSingle(user.email as string,"Number of Accured Share Changed",messageConversition)
    }
    return result;
  } catch (err: any) {
    // console.log(err)
    await session.abortTransaction();
    await session.endSession();
    throw Error(err.message || 'something Went wrong');
  }
};

const removePresedentOrVpRole = async (id: string) => {
  const result = await UserModel.findOneAndUpdate(
    { id: id },
    { role: 'member' },
    { new: true },
  );

   // send member a email 

   const user = await UserModel.findOne({ id: id });
   if (user) {
     // now turn that updated installment into a readable text
     const messageConversition = `
             <div style="font-family: Arial, sans-serif; line-height: 1.6;">
               <h2>Congratulations !</h2>
               <p><strong>Member ID:</strong> ${user.id}</p>
               <h3>You are degignated as member</h3>
               <p><strong>Message:</strong>"With a promise of being Honest annd Transparent your journy as member begins"</p>
             </div>`;

     // console.log('messageConversition', messageConversition);

     await sendEmail(
       user.email,
       `Designatated as Member`,
       messageConversition,
     );
   }
   // send member a email 
  return result;
};

const updateValueOfEachShare = async (valueOfEachShare: string) => {
  const result = await BannerMOdel.updateMany(
    {},
    { valueOfEachShare: valueOfEachShare },
    { new: true },
  );

  const messageConversition = `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>ALERT !</h2>
                <p><strong>Message:</strong>"Value of Each Share is ${valueOfEachShare} now on"</p>
              </div>`;

  await emailSendBulkOrSingle("all","SHARE VALUE UPDATE",messageConversition)
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

    // send member a email 

   const user = await UserModel.findOne({ id: id });
   if (user) {
     // now turn that updated installment into a readable text
     const messageConversition = `
             <div style="font-family: Arial, sans-serif; line-height: 1.6;">
               <h2>Your Position as a member of GolpoGriho is Dconcricated</h2>
               <p><strong>Member ID:</strong> ${user.id}</p>
               <p><strong>Message:</strong>"Thank you for being part of this journy"</p>
             </div>`;

     // console.log('messageConversition', messageConversition);

     await sendEmail(
       user.email,
       `Designatated as Member`,
       messageConversition,
     );
   }
   // send member a email 

    return {
      message: 'Member and related data successfully marked as deleted',
      success: true,
    };
  } catch (err) {
    // console.log(err);
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
