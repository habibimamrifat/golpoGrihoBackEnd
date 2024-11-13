import memberModel from '../members/member.model';
import { TUser } from '../user/user.interface';
import { TMember } from '../members/member.interface';
import { UserModel } from '../user/user.model';

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

const acceptOrCacelmemberRequest = async (id:string, requestState:string) => {
  const result = await UserModel.findOneAndUpdate({id:id },{requestState:requestState},{new:true});
  return result;
};
const deleteMember = async (id:string, requestState:string) => {
  const result = await UserModel.findOneAndUpdate({id:id },{isDelited:true},{new:true});
  return result;
};

const makePrecidenntOrVp=async(id:string, role:string)=>{
  
}

export const adminServeces = {
  findAllMember,
  findAllMemberRequests,
  acceptOrCacelmemberRequest,
};
