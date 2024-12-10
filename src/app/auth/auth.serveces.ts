import mongoose from 'mongoose';
import memberModel from '../members/member.model';
import { UserModel } from '../user/user.model';
import config from '../../config';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../user/user.interface';

const logInUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email: email }).select('+password');

  if (user) {
    // console.log(user?.password,password)
    const matched = await bcrypt.compare(password, user.password);
    if (matched) {
      if (user.requestState === 'approved') {
        const approveLogIn = await UserModel.findOneAndUpdate(
          { id: user.id, isDelited: false },
          {
            isLoggedIn: true,
          },
          { new: true },
        );
        if (approveLogIn) {
          const member = await memberModel
            .findOne({ id: user.id })
            .populate('user')
            .populate('installmentList');

          // console.log(member);
          //   create jwt token here

          const tokenizeData = {
            id: member?.id,
            role: (member?.user as TUser)?.role,
          };
          //   console.log('tocanized data', tokenizeData);

          const approvalToken = jwt.sign(
            tokenizeData,
            config.jwtTokennSecret as string,
            { expiresIn: '2d' },
          );

          const result = {
            token: approvalToken,
            userData: member,
          };

          return result
          
        } else {
          throw new Error(
            'something Went wronng or your accounnt has been deleted',
          );
        }
      } else {
        throw new Error(
          `your request to join GOLPO GRIHO is ${user.requestState}`,
        );
      }
    } else {
      throw new Error("password didn't match");
    }
  } else {
    throw new Error("Email didn't match");
  }
};

const logOutUser = async (accessToken: string) => {
  let id=""
  jwt.verify(accessToken, config.jwtTokennSecret as string,function(err,decode){
    if(err)
    {
      throw Error ("You are not authorised")
    }
    id=(decode as JwtPayload).id
  })

  const result = await UserModel.findOneAndUpdate(
    { id: id },
    {
      isLoggedIn: false,
    },
    { new: true },
  );
  return result;
};

const resetPassword = async (email: string, password: string) => {
  const findUser = await UserModel.findOne({ email: email });
  if (findUser) {
    const newPassword = await bcrypt.hash(
      password,
      Number(config.Bcrypt_SaltRound),
    );

    // console.log(newPassword);

    const updatePassword = await UserModel.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true },
    );

    // console.log(updatePassword);

    if (!updatePassword) {
      throw Error('something went wrong changing password');
    }

    return { passwordChanged: true };
  } else {
    throw Error(' the email didnt match');
  }
};

export const authServices = {
  logInUser,
  logOutUser,
  resetPassword,
};
