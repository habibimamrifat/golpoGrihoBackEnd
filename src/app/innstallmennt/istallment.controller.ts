import asyncCatch from '../../utility/asynncCatch';
import getIdFromJwtToken from '../../utility/getIDFromJwtToken';
import { InstallmentServices } from './installment.services';



const makeAInstallment = asyncCatch(async (req, res) => {
  const depositData = req.body;
  const {authorization}=req.headers 
  // console.log(authorization)
  const id = getIdFromJwtToken(authorization as string)
  // console.log(id)

  const result = await InstallmentServices.makeAInstallment(id,depositData);
  res.status(200).json({
    success: true,
    message: 'installment created successfully',
    body: result,
  });
});

const findInstallmentOfAllMembers = asyncCatch(async (req, res) => {
  const {id} = req.params
  const result = await InstallmentServices.findInstallmentOfAllMembers();
  res.status(200).json({
    success: true,
    message: 'found all installment of the member',
    body: result,
  });
});

const findInstallmentOfSingleMember = asyncCatch(async (req, res) => {
  const {id} = req.params
  const result = await InstallmentServices.findInstallmentOfSingleMember(id);
  res.status(200).json({
    success: true,
    message: 'found all installment of the member',
    body: result,
  });
});

// createIstallmenntList,
export const InstallmentController = {
  makeAInstallment,findInstallmentOfSingleMember,findInstallmentOfAllMembers
};
