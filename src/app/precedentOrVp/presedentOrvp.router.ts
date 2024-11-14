import express from "express"
import { vpOrPController } from "./vpOrP.controller"
import precedentOrVpValidatr from "./precedentOrVp.Validator"

const precedentOrVpRout = express.Router()

precedentOrVpRout.get("/findAllWaitingInstallment/:VpOrPId",precedentOrVpValidatr,vpOrPController.findAllWaitingInstallment)

precedentOrVpRout.patch("/approveOrDeclineAnInstallment/:VpOrPId",precedentOrVpValidatr,vpOrPController.approveOrDeclineAnInstallment)

export default precedentOrVpRout