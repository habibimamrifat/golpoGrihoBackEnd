import express from "express"
import { adminConntroller } from "./admin.controller"
import validator from "../../middleware/validator"
import { adminInputValidator } from "./adminInput.validator"
import auth from "../../middleware/auth"
import { UserRole } from "../user/user.constant"

const adminRouts = express.Router()

adminRouts.get("/allMembers",auth(UserRole.admin),adminConntroller.findAllMember)
adminRouts.get("/allMemberRequests",adminConntroller.findAllMemberRequests)
adminRouts.get("/findPrecedentAndVp",adminConntroller.findPrecedentAndVp)


adminRouts.patch("/acceptMemberRequest",validator(adminInputValidator.AcceptRequestValidator) ,auth(UserRole.admin) ,adminConntroller.acceptOrCacelmemberRequest)

adminRouts.patch("/makePrecidentOrVp",validator(adminInputValidator.MakePrecidentOrVp) ,auth(UserRole.admin) ,adminConntroller.makePrecidentOrVp)

adminRouts.patch("/updateAccuiredNumberOfShareOfAMember",validator(adminInputValidator.updateShareCount) ,auth(UserRole.admin) ,adminConntroller.updateAccuiredNumberOfShareOfAMember)


adminRouts.patch("/removePresedentOrVpRole/:VpOrPId",auth(UserRole.admin) ,adminConntroller.removePresedentOrVpRole)

adminRouts.patch("/updateValueOfEachShare/:valueOfEachShare",auth(UserRole.admin) ,adminConntroller.updateValueOfEachShare)

adminRouts.delete("/deleteMember/:memberId",auth(UserRole.admin) ,adminConntroller.deleteMember)

export default adminRouts