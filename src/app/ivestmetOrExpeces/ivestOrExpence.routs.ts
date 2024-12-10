import express from 'express';
import { investOrExpacesController } from './investOrExpences.controller';
import validator from '../../middleware/validator';
import { InvestmentCycleIputZodValSchema, InvestOrExpensesZodValSchema } from './invesrtmentOrExpeces.validator';
import { UserRole } from '../user/user.constant';
import auth from '../../middleware/auth';
const investOrExpenncesRouts = express.Router();

investOrExpenncesRouts.post("/createInvestOrExpaces/:adminOrVPOrPId",auth(UserRole.admin, UserRole.precident,UserRole.vicePrecident),validator(InvestOrExpensesZodValSchema),investOrExpacesController.createInvestOrExpaces)

investOrExpenncesRouts.patch("/giveAInputInInvestmentCycle/:adminOrVPOrPId",auth(UserRole.admin, UserRole.precident,UserRole.vicePrecident),validator(InvestmentCycleIputZodValSchema),investOrExpacesController.giveAInputInInvestmentCycle)

investOrExpenncesRouts.patch("/disContinueANInvestment/:adminOrVPOrPId/:investmentId",auth(UserRole.admin, UserRole.precident,UserRole.vicePrecident),investOrExpacesController.disContinueANInvestment)

investOrExpenncesRouts.get("/fidAllIvestmetAndExpences",investOrExpacesController.fidAllIvestmetAndExpences)

investOrExpenncesRouts.get("/findSingleIvestmetOrExpences/:investOrExpenncesId",investOrExpacesController.findSingleIvestmetAndExpences)


export default investOrExpenncesRouts;
