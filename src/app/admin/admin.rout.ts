import express from "express"
import { adminConntroller } from "./admin.controller"
import validator from "../../middleware/validator"
import { adminInputValidator } from "./adminInput.validator"
import adminValidator from "./adminValidator.utill"

const adminRouts = express.Router()

adminRouts.get("/allMembers",adminConntroller.findAllMember)
adminRouts.get("/allMemberRequests",adminConntroller.findAllMemberRequests)
adminRouts.get("/findPrecedentAndVp",adminConntroller.findPrecedentAndVp)


adminRouts.patch("/acceptMemberRequest/:adminId",validator(adminInputValidator.AcceptRequestValidator) ,adminValidator ,adminConntroller.acceptOrCacelmemberRequest)

adminRouts.patch("/makePrecidentOrVp/:adminId",validator(adminInputValidator.MakePrecidentOrVp) ,adminValidator ,adminConntroller.makePrecidentOrVp)


adminRouts.patch("/removePresedentOrVpRole/:adminId/:VpOrPId",adminValidator ,adminConntroller.removePresedentOrVpRole)

adminRouts.delete("/deleteMember/:adminId/:memberId",adminValidator ,adminConntroller.deleteMember)

export default adminRouts