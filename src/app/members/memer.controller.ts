import { NextFunction, Request, RequestHandler, Response } from 'express';
import { memberServices } from './member.services';
import asyncCatch from '../../utility/asynncCatch';

const findSingleMember = asyncCatch(async (req, res) => {
  const id = req.params.id;

  const result = await memberServices.findSingleMember(id);
  res.status(200).json({
    success: true,
    message: 'the member is created successfully',
    body: result,
  });
});

const logInMember = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, passWord } = req.params;

    const result = await memberServices.logInMember(email, passWord);
    res.status(200).json({
      success: true,
      message: 'the member is found',
      body: result,
    });
  },
);

export const memberController = {
  findSingleMember,
  logInMember,
};
