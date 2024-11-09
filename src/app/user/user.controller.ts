import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.serveces';
import responseHandeler from '../../utility/responseHandeler';
import asyncCatch from '../../utility/asynncCatch';

const createMember = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const member = req.body.member;
    const user = req.body.user;
    // console.log("i am the member",member)
    console.log('yoooo', member, user);

    const result = await UserServices.createAMemberInDb(user, member);

    responseHandeler(res, {
      status: 200,
      success: true,
      message: 'member is created',
      data: result,
    });
  },
);

export const UserController = {
  createMember,
};
