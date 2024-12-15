import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT,
  NODE_ENV:process.env.NODE_ENV,
  DataBase_Url: process.env.DataBase_Url!,
  Bcrypt_SaltRound:process.env.bcrypt_SaltRound,
  jwtTokennSecret:process.env.jwtTokenSecret,
  jwtRefreshTokenSecret:process.env.jwtRefreshTokenSecret,
  jwtTokennExireIn:process.env.jwtTokennExireIn,
  jwtRefreshTokennExpireIn:process.env.jwtRefreshTokennExpireIn,
  FrontEndHostedPort:process.env.FrontEndHostedPort,
  GmailAppPassword:process.env.gmailAppPassword,
  companyGmail:process.env.companyGmail
};
