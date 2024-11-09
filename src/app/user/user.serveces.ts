import { TMember } from '../members/member.interface';
import memberModel from '../members/member.model';
import idGearator from './idGenarator.utill';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const createAMemberInDb = async (user: Partial<TUser>, memberData: TMember) => {
  user.role="admin"
  user.requestState="approved"

  // menually genarated id is here
  //this id will be auto genarated letter
  const id =await idGearator(memberData.name.lastName)
  user.id=id

  const result =await  UserModel.create(user)
  if(Object.keys(result).length)
  {
    memberData.id= user.id;
    memberData.user=result._id;
    const newMember =await memberModel.create(memberData)
  }
  return result;
};

export const UserServices = {
  createAMemberInDb,
};
