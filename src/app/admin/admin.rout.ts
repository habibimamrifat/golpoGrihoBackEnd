import express from "express"
import { adminConntroller } from "./admin.controller"
import validator from "../../middleware/validator"
import { adminInputValidator } from "./adminInput.validator"
import adminValidator from "./adminValidator.utill"

const adminRouts = express.Router()

adminRouts.get("/allMembers",adminConntroller.findAllMember)
adminRouts.get("/allMemberRequests",adminConntroller.findAllMemberRequests)

adminRouts.patch("/acceptMemberRequest/:adminId",validator(adminInputValidator.AcceptRequestValidator) ,adminValidator ,adminConntroller.acceptOrCacelmemberRequest)

export default adminRouts