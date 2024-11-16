import express from 'express';
import { UserController } from './user.controller';
import { memberValidations } from '../members/member.zodValidation';
import validator from '../../middleware/validator';

const userRouts = express.Router();


userRouts.post('/createUser', validator(memberValidations.createMemberZodSchema), UserController.createMember);
userRouts.get("/logIn/:email/:password", UserController.logInUser)
userRouts.patch("/logOut/:user_id", UserController.logOutUser)

export const UserRouts = userRouts;
