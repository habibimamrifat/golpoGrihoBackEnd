import express from "express"
import { adminConntroller } from "./admin.controller"
import validator from "../../middleware/validator"
import { adminInputValidator } from "./adminInput.validator"
import auth from "../../middleware/auth"
import { UserRole } from "../user/user.constant"

const adminRouts = express.Router()

adminRouts.get("/allMembers",adminConntroller.findAllMember)
adminRouts.get("/allMemberRequests",adminConntroller.findAllMemberRequests)
adminRouts.get("/findPrecedentAndVp",adminConntroller.findPrecedentAndVp)


adminRouts.patch("/acceptMemberRequest",validator(adminInputValidator.AcceptRequestValidator) ,auth(UserRole.admin) ,adminConntroller.acceptOrCacelmemberRequest)

adminRouts.patch("/makePrecidentOrVp/:adminId",validator(adminInputValidator.MakePrecidentOrVp) ,auth(UserRole.admin) ,adminConntroller.makePrecidentOrVp)

adminRouts.patch("/updateAccuiredNumberOfShareOfAMember/:adminId",validator(adminInputValidator.updateShareCount) ,auth(UserRole.admin) ,adminConntroller.updateAccuiredNumberOfShareOfAMember)


adminRouts.patch("/removePresedentOrVpRole/:adminId/:VpOrPId",auth(UserRole.admin) ,adminConntroller.removePresedentOrVpRole)

adminRouts.patch("/updateValueOfEachShare/:adminId/:valueOfEachShare",auth(UserRole.admin) ,adminConntroller.updateValueOfEachShare)

adminRouts.delete("/deleteMember/:adminId/:memberId",auth(UserRole.admin) ,adminConntroller.deleteMember)

export default adminRouts