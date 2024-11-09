import express from "express"
import { memberController } from "./memer.controller"
const memberRoutes = express.Router()


memberRoutes.get("/findMember/:id", memberController.findSingleMember)
memberRoutes.get("/findMember/:email/:passWord", memberController.logInMember)

export default memberRoutes

