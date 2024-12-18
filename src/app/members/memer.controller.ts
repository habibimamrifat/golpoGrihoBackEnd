
import { memberServices } from './member.services';
import asyncCatch from '../../utility/asynncCatch';

const findSingleMember = asyncCatch(async (req, res) => {
  const id = req.params.id;

  const result = await memberServices.findSingleMember(id);
  res.status(200).json({
    success: true,
    message: 'The member is fetched successfully',
    body: result,
  });
});
const updateAmemberData = asyncCatch(async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  const {updatedData} = req.body

  const result = await memberServices.updateAmemberData(id,updatedData);
  res.status(200).json({
    success: true,
    message: 'the member is updated successfully',
    body: result,
  });
});



export const memberController = {
  findSingleMember,
  updateAmemberData
};
