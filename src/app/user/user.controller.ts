import { UserServices } from './user.serveces';
import responseHandeler from '../../utility/responseHandeler';
import asyncCatch from '../../utility/asynncCatch';

const createMember = asyncCatch(
  async (req, res, next) => {
    const member = req.body.member;
    const user = req.body.user;


    const result = await UserServices.createAMemberInDb(user, member);

    responseHandeler(res, {
      status: 200,
      success: true,
      message: 'Your request to join is on hold. We will let you know soon',
      data: result,
    });
  },
);



export const UserController = {
  createMember
};
