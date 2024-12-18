
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { TMember } from '../members/member.interface';
import memberModel from '../members/member.model';
import idGearator from './idGenarator.utill';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import mongoose from 'mongoose';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';
import { BannerServeces } from '../banner/banner.servicces';

const createAMemberInDb = async (user: Partial<TUser>, memberData: TMember) => {
  const id = await idGearator(memberData.name.lastName);
  user.id = id;

  try {
    const isFirstUser = await UserModel.find();
    if (isFirstUser.length === 0) {
      user.role = 'admin';
      user.requestState = 'approved';
    }
  } catch (err) {
    throw Error('something went wrong in in userController isFirstUser');
  }

  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userInstance = new UserModel(user);
    await userInstance.save({ session });

    const installmentInstance = new InstallmentListtModel({ id: id });
    await installmentInstance.save({ session });

    const ShareDetailInstace = new ShareDetailModel({ id: id });
    ShareDetailInstace.save({ session });

    memberData.id = id;
    memberData.user = userInstance._id;
    memberData.acccuiredShareDetail = ShareDetailInstace._id;
    memberData.installmentList = installmentInstance._id;

    const memberInstance = new memberModel(memberData);
    await memberInstance.save({ session });

    await session.commitTransaction();


    await BannerServeces.updateBannerTotalMember()
    await BannerServeces.updateBannerTotalumberOfShare()

    return memberInstance;
  } catch (err: any) {
    // Abort transaction on error
    await session.abortTransaction();
    throw new Error(err.message || 'Something went wrong');
  } finally {
    session.endSession();
  }
};


export const UserServices = {
  createAMemberInDb,
  
};
