import memberModel from '../members/member.model';
import { UserModel } from '../user/user.model';
import config from '../../config';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../user/user.interface';
import createToken from './auth.utill';
import { sendEmail } from '../../utility/sendEmail';

const logInUser = async (email: string, password: string) => {
  // Fetch user with required fields and verify password
  const user = await UserModel.findOne({ email }).select("+password +requestState").lean();
  if (!user) throw new Error("Email didn't match");

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) throw new Error("Password didn't match");

  // Check account approval state
  if (user.requestState !== "approved") {
    throw new Error(`Your request to join GOLPO GRIHO is ${user.requestState}`);
  }

  // Update `isLoggedIn` in one query and fetch updated user details
  const approveLogIn = await UserModel.findOneAndUpdate(
    { id: user.id, isDelited: false },
    { isLoggedIn: true },
    { new: true, fields: "id role" } // Select only required fields
  ).lean();

  if (!approveLogIn) {
    throw new Error("Something went wrong or your account has been deleted");
  }

  // Tokenize user data
  const tokenizeData = { id: approveLogIn.id, role: approveLogIn.role };
  const approvalToken = createToken(tokenizeData, config.jwtTokennSecret as string, config.jwtTokennExireIn as string);
  const refreshToken = createToken(tokenizeData, config.jwtRefreshTokenSecret as string, config.jwtRefreshTokennExpireIn as string);

  return { approvalToken, refreshToken, approveLogIn };
};


const logOutUser = async (accessToken: string) => {
  let id = '';
  jwt.verify(
    accessToken,
    config.jwtTokennSecret as string,
    function (err, decode) {
      if (err) {
        throw Error('You are not authorised');
      }
      id = (decode as JwtPayload).id;
    },
  );

  const result = await UserModel.findOneAndUpdate(
    { id: id },
    {
      isLoggedIn: false,
      logOutTime: new Date(),
    },
    { new: true },
  );
  return result;
};

const changePassword = async (
  authorizationToken: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Decode the token
  const decoded = jwt.verify(
    authorizationToken,
    config.jwtTokennSecret as string,
  ) as JwtPayload;

  if (!decoded || !decoded.id) {
    throw Error('Invalid or unauthorized token');
  }

  const { id } = decoded;

  // Find the user and include the password field
  const findUser = await UserModel.findOne({ id }).select('+password');

  if (!findUser || !findUser.password) {
    throw Error('User not found or password missing');
  }

  // Compare old password with hashed password
  const isPasswordMatch = await bcrypt.compare(oldPassword, findUser.password);

  if (!isPasswordMatch) {
    throw Error('Old password did not match');
  }

  // Hash the new password
  const newPasswordHash = await bcrypt.hash(
    newPassword,
    Number(config.Bcrypt_SaltRound),
  );

  // Update the user's password and passwordChangeTime
  const updatePassword = await UserModel.findOneAndUpdate(
    { id },
    {
      password: newPasswordHash,
      passwordChangeTime: new Date(),
    },
    { new: true },
  );

  if (!updatePassword) {
    throw Error('Error updating password');
  }

  return { passwordChanged: true };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwtRefreshTokenSecret as string,
  );

  if (!decoded) {
    throw Error('tocan decodaing Failed');
  }

  const { id, iat, role } = decoded as JwtPayload;

  const findUser = await UserModel.findOne({
    id: id,
    requestState: 'approved',
    isDelited: false,
  });
  if (!findUser) {
    throw Error('Unauthorised User or forbitten Access');
  }

  // console.log(findUser)
  if ((findUser.passwordChangeTime || findUser.logOutTime) && iat) {
    const passwordChangedAt = findUser.passwordChangeTime
      ? new Date(findUser.passwordChangeTime).getTime() / 1000
      : null;

    const logOutTimedAt = findUser.logOutTime
      ? new Date(findUser.logOutTime).getTime() / 1000
      : null;

    if (
      (passwordChangedAt && passwordChangedAt > iat) ||
      (logOutTimedAt && logOutTimedAt > iat)
    ) {
      throw Error('Unauthorized User: Try logging in again');
    }
  }

  const JwtPayload = {
    id: findUser.id,
    role: role,
  };
  const approvalToken = createToken(
    JwtPayload,
    config.jwtTokennSecret as string,
    config.jwtTokennExireIn as string,
  );

  return {
    approvalToken,
  };
};

const forgetPassword = async (id: string) => {
  // console.log(id)

  const user = await UserModel.findOne({ id: id });
  if (user) {
    if (user?.isDelited) {
      throw Error('this user is deleted this function is not available');
    }
    if (user.requestState !== 'approved') {
      throw Error('this user is deleted this function is not available');
    }

    const tokenizeData = {
      id: user?.id,
      role: user?.role,
    };
    //   console.log('tocanized data', tokenizeData);

    const resetToken = createToken(
      tokenizeData,
      config.jwtTokennSecret as string,
      '10m',
    );

    // console.log(resetToken)

    const passwordResetUrl = `${config.FrontEndHostedPort}?id=${user.id}&token=${resetToken}`;
    console.log(passwordResetUrl);

    await sendEmail(user.email, 'Reset Password', passwordResetUrl);
  } else {
    throw Error('the user is not found');
  }
};

const resetPassword = async (
  authorizationToken: string,
  userId: string,
  newPassword: string,
) => {
  // Decode the token
  const decoded = jwt.verify(
    authorizationToken,
    config.jwtTokennSecret as string,
  ) as JwtPayload;

  if (!decoded || !decoded.id) {
    throw Error('Invalid or unauthorized token');
  }

  const { id } = decoded;
  if (id === userId) {
    // Find the user and include the password field
    const findUser = await UserModel.findOne({ id }).select('+password');

    if (!findUser || !findUser.password) {
      throw Error('User not found or password missing');
    }


    // Hash the new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      Number(config.Bcrypt_SaltRound),
    );

    // Update the user's password and passwordChangeTime
    const updatePassword = await UserModel.findOneAndUpdate(
      { id },
      {
        password: newPasswordHash,
        passwordChangeTime: new Date(),
      },
      { new: true },
    );

    if (!updatePassword) {
      throw Error('Error updating password');
    }

    return { passwordChanged: true };
  }
  else
  {
    throw Error("Invalid User")
  }

};

const collectProfileData =async(id:string)=>{
  const result = await memberModel.findOne({id:id}).populate("user").populate("acccuiredShareDetail").populate("installmentList")
  return result
}

export const authServices = {
  logInUser,
  logOutUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  collectProfileData
};
