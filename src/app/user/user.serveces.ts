import bcrypt from 'bcrypt';
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { TMember } from '../members/member.interface';
import memberModel from '../members/member.model';
import idGearator from './idGenarator.utill';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import mongoose from 'mongoose';
import { BannerServeces } from '../banner/banner.servicces';
import { ShareDetailModel } from '../shareDetail/shareDetail.model';

const createAMemberInDb = async (user: Partial<TUser>, memberData: TMember) => {
  const id = await idGearator(memberData.name.lastName);
  user.id = id;

  const isFirstUser = await UserModel.find();
  if (isFirstUser.length === 0) {
    (user.role = 'admin'), (user.requestState = 'approved');
  }

  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userInstance = new UserModel(user);
    await userInstance.save({ session });

    const installmentInstance = new InstallmentListtModel({ id: id });
    await installmentInstance.save({ session });

    const ShareDetailInstace = new ShareDetailModel({id:id})
    ShareDetailInstace.save({session})

    memberData.id = id;
    memberData.user = userInstance._id;
    memberData.acccuiredShareDetail=ShareDetailInstace._id;
    memberData.installmentList = installmentInstance._id;

    const memberInstance = new memberModel(memberData);
    await memberInstance.save({ session });

    await session.commitTransaction();

    // for banner update
    await BannerServeces.updateBannerTotalMember();

    return memberInstance;
  } catch (err: any) {
    // Abort transaction on error
    await session.abortTransaction();
    throw new Error(err.message || 'Something went wrong');
  } finally {
    session.endSession();
  }
};

const logInUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email: email });

  if (user) {
    // console.log(user?.password,password)
    const matched = await bcrypt.compare(password, user.password);
    if (matched) {
      if (user.requestState === 'approved') {
        const approveLogIn = await UserModel.findOneAndUpdate(
          { id: user.id, isDelited: false },
          {
            isLoggedIn: true,
          },
          { new: true },
        );
        if (approveLogIn) {
          const result = await memberModel
            .findOne({ id: user.id })
            .populate('user')
            .populate('installmentList');
          return result;
        } else {
          throw new Error(
            'something Went wronng or your accounnt has been deleted',
          );
        }
      } else {
        throw new Error(
          `your request to join GOLPO GRIHO is ${user.requestState}`,
        );
      }
    } else {
      throw new Error("password didn't match");
    }
  } else {
    throw new Error("Email didn't match");
  }
};

const logOutUser = async (_id: string) => {
  const result = await UserModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(_id) },
    {
      isLoggedIn: false,
    },
    { new: true },
  );
  return result;
};

export const UserServices = {
  createAMemberInDb,
  logInUser,
  logOutUser,
};
