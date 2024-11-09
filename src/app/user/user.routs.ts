import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { AnyZodObject } from 'zod';
import { memberValidations } from '../members/member.zodValidation';
import validator from '../../middleware/validator';

const userRouts = express.Router();


userRouts.post('/createUser', validator(memberValidations.createMemberZodSchema), UserController.createMember);
userRouts.get("/logIn/:email/:password", UserController.logInUser)

export const UserRouts = userRouts;
