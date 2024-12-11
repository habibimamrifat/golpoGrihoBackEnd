import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../app/user/user.model';
import asyncCatch from '../utility/asynncCatch';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../app/user/user.interface';

const auth = (...requeredUserRole: TUserRole[]) => {
  return asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const authorizatioToken = req?.headers?.authorization;

    // console.log(authorizatioToken);
    if (!authorizatioToken) {
      throw Error('UnAuthorised User');
    }

    const decoded = jwt.verify(
      authorizatioToken,
      config.jwtTokennSecret as string,
    );
    if (!decoded) {
      throw Error('tocan decodaing Failed');
    }

    const {id,role,iat,exp}= decoded as JwtPayload

    if (requeredUserRole && !requeredUserRole.includes(role)) {
      throw Error('UnAuthorised User');
    }

    const findUser = await UserModel.findOne({id:id})
    // console.log(findUser)

    

    

    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
