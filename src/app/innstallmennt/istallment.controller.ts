import asyncCatch from '../../utility/asynncCatch';
import { InstallmentServices } from './installment.services';

const createIstallmenntList = asyncCatch(async (req, res) => {
  const depositData = req.body;
  const result = await InstallmentServices.createInstallmentList(depositData);
  res.status(200).json({
    success: true,
    message: 'deposit List created successfully',
    body: result,
  });
});

const makeAInstallment = asyncCatch(async (req, res) => {
  const depositData = req.body;
  const result = await InstallmentServices.makeAInstallment(depositData);
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

export const InstallmentController = {
  createIstallmenntList,makeAInstallment,findInstallmentOfSingleMember,findInstallmentOfAllMembers
};
