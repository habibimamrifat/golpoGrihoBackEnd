import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import asyncCatch from '../../utility/asynncCatch';
import { authServices } from './auth.serveces';

const logInUser = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login Payload:", { email }); // Minimal logging for debugging

  const { approvalToken, refreshToken, approveLogIn } = await authServices.logInUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict", // Extra CSRF protection
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    body: { approvalToken, approveLogIn },
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

const changePassword = asyncCatch(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const authorizationToken = req.headers?.authorization as string;

  const result = await authServices.changePassword(
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

const forgetPassword =asyncCatch(async(req, res, next)=>{
  const id=req.body?.id
  const result = await authServices.forgetPassword(id)
  res.status(200).json({
    success: true,
    message: 'reset password token genarated check your email',
    body: null
  });
})

const resetPassword = asyncCatch(async (req, res, next) => {
  const { id, newPassword } = req.body;
  const authorizationToken = req.headers?.authorization as string;
  // console.log(req.body)

  const result = await authServices.resetPassword(
    authorizationToken,
    id,
    newPassword,
  );

  res.status(200).json({
    success: true,
    message: 'password changed',
    body: result,
  });
});

const collectProfileData=asyncCatch(async(req, res,next)=>{
const user = req.user as JwtPayload
const result = await authServices.collectProfileData(user.id)
res.status(200).json({
  success: true,
  message: 'password changed',
  body: result,
});
})


export const authController = {
  logInUser,
  logOutUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  collectProfileData
};
