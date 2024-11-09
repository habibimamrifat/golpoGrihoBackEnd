import express from "express"
import { memberController } from "./memer.controller"
const memberRoutes = express.Router()


memberRoutes.get("/findMember/:id", memberController.findSingleMember)

export default memberRoutes

