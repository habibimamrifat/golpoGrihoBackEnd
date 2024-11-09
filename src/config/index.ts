import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT,
  DataBase_Url: process.env.DataBase_Url!,
  Bcrypt_SaltRound:process.env.bcrypt_SaltRound
};
