import express, { Request, Response } from 'express';
import { InstallmentController } from './istallment.controller';
import validator from '../../middleware/validator';
import {
  InstallmenntZodListSchema,
  MakeAInstallmentZodSchema,
} from './installment.validation';

const installmenttRout = express.Router();
// installmenttRout.post(
//   '/createInstallmentList',
//   validator(InstallmenntZodListSchema),
//   InstallmentController.createIstallmenntList,
// );


installmenttRout.post(
  '/makeAInstallment',
  validator(MakeAInstallmentZodSchema),
  InstallmentController.makeAInstallment,
);


installmenttRout.get(
  '/findInstallmentOfAllMembers',
  InstallmentController.findInstallmentOfAllMembers,
);


installmenttRout.get(
  '/findInstallmentOfAMember/:id',
  InstallmentController.findInstallmentOfSingleMember,
);

export default installmenttRout;
