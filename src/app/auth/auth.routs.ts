import express from "express"
import { authController } from "./auth.controller"
const authRouts = express.Router()


authRouts.post("/logIn", authController.logInUser)
authRouts.patch("/logOut/:user_id", authController.logOutUser)
authRouts.patch("/resetPassword/:email/:newPassword",authController.resetPassword)

export default authRouts