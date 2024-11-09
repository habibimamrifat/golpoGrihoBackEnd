import { TMember } from './member.interface';
import memberModel from './member.model';
import bcrypt from 'bcrypt';



const findSingleMember = async (id: string) => {
  const result = await memberModel.findOne({ _id: id });
  return result;
};

const logInMember = async (email: string, passWord: string) => {
  const member = await memberModel.findOne({ email: email });
  if (member) {
    const matched = await bcrypt.compare(passWord, member.passWord);
    if (matched) {
      return member;
    } else {
      throw new Error("password didn't match");
    }
  } else {
    throw new Error("Email didn't match");
  }
};

export const memberServices = {
 
  findSingleMember,
  logInMember,
};
