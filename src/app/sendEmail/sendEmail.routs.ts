import express from "express"
import auth from "../../middleware/auth"
import { UserRole } from "../user/user.constant"
import { sendEmailConreoller } from "./sendEmail.controller"
const sendEmailRout = express.Router()

sendEmailRout.post("/sensEmail", auth(UserRole.admin,UserRole.precident,UserRole.vicePrecident),sendEmailConreoller.sendEmail)

export default sendEmailRout