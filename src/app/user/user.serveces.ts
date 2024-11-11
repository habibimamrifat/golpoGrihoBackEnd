import bcrypt from "bcrypt"
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { TMember } from '../members/member.interface';
import memberModel from '../members/member.model';
import idGearator from './idGenarator.utill';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import mongoose from "mongoose";


const createAMemberInDb = async (user: Partial<TUser>, memberData: TMember) => {
  user.role = "admin";
  user.requestState = "approved";
  const id = await idGearator(memberData.name.lastName);
  user.id = id;

  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
    const userInstance = new UserModel(user);
    await userInstance.save({ session });

   
    const installmentInstance = new InstallmentListtModel({ id: id });
    await installmentInstance.save({ session });

    
    memberData.id = id;
    memberData.user = userInstance._id;
    memberData.installmentList = installmentInstance._id;
    
    const memberInstance = new memberModel(memberData);
    await memberInstance.save({ session });

    
    await session.commitTransaction();
    return memberInstance;
  } catch (err) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error("Transaction failed:", err);
    throw new Error("Something went wrong");
  } finally {
    // End the session
    session.endSession();
  }
};

const logInUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email: email });
 
  if (user) {
    // console.log(user?.password,password)
    const matched = await bcrypt.compare(password, user.password);
    if (matched) {
      if(user.requestState === "approved")
      {
        const result =await memberModel.findOne({id:user.id})
        return result;
      }
      else{
        throw new Error(`your request to join GOLPO GRIHO is ${user.requestState}`)
      }
    } else {
      throw new Error("password didn't match");
    }
  } else {
    throw new Error("Email didn't match");
  }
};

export const UserServices = {
  createAMemberInDb,logInUser
};
