import { TMember } from './member.interface';
import memberModel from './member.model';



const findSingleMember = async (id: string) => {
  const result = await memberModel.findOne({ _id: id });
  return result;
};



export const memberServices = {
 
  findSingleMember
};
