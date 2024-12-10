import asyncCatch from "../../utility/asynncCatch";
import { authServices } from "./auth.serveces";

const logInUser = asyncCatch(
    async (req, res, next) => {
     const payload = req.body
     console.log(payload)
  
      const result = await authServices.logInUser(payload.email, payload.password);
      res.status(200).json({
        success: true,
        message: 'log in successfull',
        body: result,
      });
    },
  );
  
  const logOutUser = asyncCatch(
    async (req, res, next) => {
      const accessToken = req.headers?.authorization;
      if(!accessToken)
      {
        throw Error ("the access token is missing,or you are not authorised")
      }
  
      const result = await authServices.logOutUser(accessToken);
      res.status(200).json({
        success: true,
        message: 'log out successfull',
        body: result,
      });
    },
  );
  
  const resetPassword = asyncCatch(
    async (req, res, next) => {
      const { email,newPassword} = req.params;
  
      const result = await authServices.resetPassword(email,newPassword);
      res.status(200).json({
        success: true,
        message: 'password changed',
        body: result,
      });
    },
  );

  export const authController = {
    logInUser,logOutUser,resetPassword
  }