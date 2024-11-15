import express from "express"
import { memberController } from "./memer.controller"
import validator from "../../middleware/validator"
import { memberValidations } from "./member.zodValidation"
const memberRoutes = express.Router()


memberRoutes.get("/findMember/:id", memberController.findSingleMember)
memberRoutes.patch("/updateAmemberData/:id",validator(memberValidations.memmberDataUpdateZodSchema), memberController.updateAmemberData)

export default memberRoutes

