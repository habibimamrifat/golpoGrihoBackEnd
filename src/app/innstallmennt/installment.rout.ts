import express, { Request, Response } from 'express';
import { InstallmentController } from './istallment.controller';
import validator from '../../middleware/validator';
import {
  InstallmenntZodListSchema,
  MakeAInstallmentZodSchema,
} from './installment.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const installmenttRout = express.Router();
// installmenttRout.post(
//   '/createInstallmentList',
//   validator(InstallmenntZodListSchema),
//   InstallmentController.createIstallmenntList,
// );



installmenttRout.post(
  '/makeAInstallment',
  validator(MakeAInstallmentZodSchema),auth(UserRole.admin,UserRole.member,UserRole.precident,UserRole.vicePrecident),
  InstallmentController.makeAInstallment,
);


installmenttRout.get(
  '/findInstallmentOfAllMembers',auth(UserRole.admin,UserRole.member,UserRole.precident,UserRole.vicePrecident),
  InstallmentController.findInstallmentOfAllMembers,
);


installmenttRout.get(
  '/findInstallmentOfAMember/:id',auth(UserRole.admin,UserRole.member,UserRole.precident,UserRole.vicePrecident),
  InstallmentController.findInstallmentOfSingleMember,
);

export default installmenttRout;
