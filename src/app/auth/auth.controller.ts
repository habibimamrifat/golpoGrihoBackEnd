import config from '../../config';
import asyncCatch from '../../utility/asynncCatch';
import { authServices } from './auth.serveces';

const logInUser = asyncCatch(async (req, res, next) => {
  const payload = req.body;
  // console.log(payload);

  const result = await authServices.logInUser(payload.email, payload.password);

  const { approvalToken, refreshToken, member } = result;

  res.cookie("refreshToken", refreshToken,{
    secure:config.NODE_ENV === "production",
    httpOnly:true
  })


  res.status(200).json({
    success: true,
    message: 'log in successfull',
    body: {
      approvalToken,
      member,
    },
  });
});

const logOutUser = asyncCatch(async (req, res, next) => {
  const accessToken = req.headers?.authorization;
  if (!accessToken) {
    throw Error('the access token is missing,or you are not authorised');
  }

  const result = await authServices.logOutUser(accessToken);
  res.status(200).json({
    success: true,
    message: 'log out successfull',
    body: result,
  });
});

const resetPassword = asyncCatch(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const authorizationToken = req.headers?.authorization as string;

  const result = await authServices.resetPassword(
    authorizationToken,
    oldPassword,
    newPassword,
  );
  res.status(200).json({
    success: true,
    message: 'password changed',
    body: result,
  });
});

const refreshToken=asyncCatch(async(req,res,next)=>{
 
  const {refreshToken}= req.cookies
  const result = await authServices.refreshToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'log token refreshed',
    body: result
  });
})

export const authController = {
  logInUser,
  logOutUser,
  resetPassword,
  refreshToken
};
