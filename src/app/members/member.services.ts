import { TMember } from './member.interface';
import memberModel from './member.model';

const findSingleMember = async (id: string) => {
  const result = await memberModel
    .findOne({ id: id })
    .populate('installmentList')
    .populate("acccuiredShareDetail");
  return result;
};

const updateAmemberData = async (id: string, updatedData: Partial<TMember>) => {
  // console.log(id)
  const {
    name,
    membersNomini,
    memberPermanentAddress,
    memberPresentAddress,
    ...remainingMemberData
  } = updatedData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingMemberData,
  };
  // console.log(Object.keys(name), Object.entries(name))

  const flatenObject = (
    prefix: string,
    obj: Record<string, any>,
    tergetObject: Record<string, unknown>,
  ) => {
    for (const [key, value] of Object.entries(obj)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        flatenObject(`${prefix}.${key}`, value, tergetObject);
      } else {
        tergetObject[`${prefix}.${key}`] = value;
      }
    }
  };



  if (name && Object.keys(name).length) {
    flatenObject('name', name, modifiedUpdatedData);
  }


  if (membersNomini && Object.keys(membersNomini).length) {
    flatenObject('membersNomini', membersNomini, modifiedUpdatedData);
  }


  if (memberPermanentAddress && Object.keys(memberPermanentAddress).length) {
    flatenObject(
      'memberPermanentAddress',
      memberPermanentAddress,
      modifiedUpdatedData,
    );
  }


  if (memberPresentAddress && Object.keys(memberPresentAddress).length) {
    flatenObject(
      'memberPresentAddress',
      memberPresentAddress,
      modifiedUpdatedData,
    );
  }

console.log(modifiedUpdatedData)

  const result = await memberModel.findOneAndUpdate(
    { id: id },
    { ...modifiedUpdatedData },
    {
      new: true,
    },
  );
  return result
};

export const memberServices = {
  findSingleMember,
  updateAmemberData,
};
