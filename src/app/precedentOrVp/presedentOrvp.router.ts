import express from "express"
import { vpOrPController } from "./vpOrP.controller"
import acceptOrDenyVpOrpSchema from "./vpOrPInput.validate"
import validator from "../../middleware/validator"
import { UserRole } from "../user/user.constant"
import auth from "../../middleware/auth"

const precedentOrVpRout = express.Router()

precedentOrVpRout.get("/findAllWaitingInstallment",auth(UserRole.precident, UserRole.vicePrecident),vpOrPController.findAllWaitingInstallment)

precedentOrVpRout.patch("/approveOrDeclineAnInstallment",auth(UserRole.precident, UserRole.vicePrecident),validator(acceptOrDenyVpOrpSchema), vpOrPController.approveOrDeclineAnInstallment)

export default precedentOrVpRout