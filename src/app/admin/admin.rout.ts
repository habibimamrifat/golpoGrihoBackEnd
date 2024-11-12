import express from "express"
import { adminConntroller } from "./admin.controller"

const adminRouts = express.Router()

adminRouts.get("/allMembers",adminConntroller.findAllMember)
adminRouts.get("/allMemberRequests",adminConntroller.findAllMemberRequests)
adminRouts.patch("/acceptMemberREquest/:adminId",adminConntroller.acceptOrCacelmemberRequest)

export default adminRouts