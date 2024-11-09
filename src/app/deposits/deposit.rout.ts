import express, { Request, Response } from "express";
import { depositController } from "./deposit.controller";
import validator from "../../middleware/validator";
import { DepositListSchema, makeADepositSchema } from "./deposit.validation";

const depositRout = express.Router()
depositRout.post("/createDepositList",validator(DepositListSchema),depositController.createDeposit )
depositRout.post("/makeADeposit",validator(makeADepositSchema), depositController.makeADeposit)

export default depositRout