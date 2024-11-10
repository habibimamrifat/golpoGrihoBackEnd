import bcrypt from "bcrypt"
import { InstallmentListtModel } from '../innstallmennt/installment.model';
import { TMember } from '../members/member.interface';
import memberModel from '../members/member.model';
import idGearator from './idGenarator.utill';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import mongoose from "mongoose";


const createAMemberInDb = async (user: Partial<TUser>, memberData: TMember) => {
  user.role="admin"
  user.requestState="approved"
  const id =await idGearator(memberData.name.lastName)
  user.id=id

  // session started
 const session =await mongoose.startSession()
  try{
    session.startTransaction()

    const createUser =await  UserModel.create([user],{session})
    // console.log(createUser)
    if(createUser && Object.keys(createUser).length)
    {
      const createInstallmentList = await InstallmentListtModel.create([{id:id}], {session})
      if(createInstallmentList && Object.keys(createInstallmentList).length)
        {
          memberData.id= id;
          memberData.user=createUser[0]._id;
          memberData.installmentList=createInstallmentList[0]._id
  
          console.log(memberData.user, memberData.installmentList)
          const newMember =await memberModel.create([memberData],{session})
          await session.commitTransaction()
          return newMember
        }
        await session.abortTransaction();
    }
  }
  catch(err)
  {
    session.endSession();
    throw new Error("something went wrong")
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
