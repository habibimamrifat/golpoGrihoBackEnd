import express from "express"
import { adminServeces } from "./admin.services"
import { adminConntroller } from "./admin.controller"

const adminRouts = express.Router()

adminRouts.get("/allMembers",adminConntroller.findAllMember)

export default adminRouts