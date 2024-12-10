import express from "express"
import { authController } from "./auth.controller"
import validator from "../../middleware/validator"
import { changePasswordSchema, logInSchema } from "./auth.validation"
const authRouts = express.Router()


authRouts.post("/logIn",validator(logInSchema), authController.logInUser)
authRouts.patch("/logOut", authController.logOutUser)
authRouts.patch("/resetPassword/:email/:newPassword",validator(changePasswordSchema),authController.resetPassword)

export default authRouts