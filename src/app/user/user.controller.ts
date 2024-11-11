import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.serveces';
import responseHandeler from '../../utility/responseHandeler';
import asyncCatch from '../../utility/asynncCatch';

const createMember = asyncCatch(
  async (req, res, next) => {
    const member = req.body.member;
    const user = req.body.user;
    // console.log("i am the member",member)
    // console.log('yoooo', member, user);

    const result = await UserServices.createAMemberInDb(user, member);

    responseHandeler(res, {
      status: 200,
      success: true,
      message: 'Member is created',
      data: result,
    });
  },
);

const logInUser = asyncCatch(
  async (req, res, next) => {
    const { email, password } = req.params;

    const result = await UserServices.logInUser(email, password);
    res.status(200).json({
      success: true,
      message: 'the member is found',
      body: result,
    });
  },
);

export const UserController = {
  createMember,logInUser
};
