import express from "express"
import { authController } from "./auth.controller"
import validator from "../../middleware/validator"
import { changePasswordSchema, forgetPassword, logInSchema, refreshTokenSchema, resetPassword } from "./auth.validation"
import auth from "../../middleware/auth"
import { UserRole } from "../user/user.constant"
const authRouts = express.Router()


authRouts.post("/logIn",validator(logInSchema), authController.logInUser)
authRouts.patch("/logOut",auth(UserRole.admin,UserRole.member,UserRole.precident,UserRole.vicePrecident), authController.logOutUser)
authRouts.post("/changePassword",auth(UserRole.admin,UserRole.member,UserRole.precident,UserRole.vicePrecident),validator(changePasswordSchema),authController.changePassword)
authRouts.post("/refresh-token", validator(refreshTokenSchema), authController.refreshToken)
authRouts.post("/forgetPassword",validator(forgetPassword),authController.forgetPassword)
authRouts.post("/resetPassword",validator(resetPassword),authController.resetPassword)



export default authRouts