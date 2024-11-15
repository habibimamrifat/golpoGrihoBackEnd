import express from "express"
import { vpOrPController } from "./vpOrP.controller"
import precedentOrVpValidatr from "./precedentOrVp.Validator"
import acceptOrDenyVpOrpSchema from "./vpOrPInput.validate"
import validator from "../../middleware/validator"

const precedentOrVpRout = express.Router()

precedentOrVpRout.get("/findAllWaitingInstallment/:VpOrPId",precedentOrVpValidatr,vpOrPController.findAllWaitingInstallment)

precedentOrVpRout.patch("/approveOrDeclineAnInstallment/:VpOrPId",precedentOrVpValidatr,validator(acceptOrDenyVpOrpSchema), vpOrPController.approveOrDeclineAnInstallment)

export default precedentOrVpRout