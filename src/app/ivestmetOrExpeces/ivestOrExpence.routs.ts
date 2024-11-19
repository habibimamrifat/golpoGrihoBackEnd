import express from 'express';
import { investOrExpacesController } from './investOrExpences.controller';
import admiOrPrecedentOrVpValidatr from './adminOrVPAndP.validator';
import validator from '../../middleware/validator';
import { InvestmentCycleIputZodValSchema, InvestOrExpensesZodValSchema } from './invesrtmentOrExpeces.validator';
const investOrExpenncesRouts = express.Router();

investOrExpenncesRouts.post("/createInvestOrExpaces/:adminOrVPOrPId",admiOrPrecedentOrVpValidatr,validator(InvestOrExpensesZodValSchema),investOrExpacesController.createInvestOrExpaces)

investOrExpenncesRouts.patch("/giveAInputInInvestmentCycle/:adminOrVPOrPId",admiOrPrecedentOrVpValidatr,validator(InvestmentCycleIputZodValSchema),investOrExpacesController.giveAInputInInvestmentCycle)

investOrExpenncesRouts.get("/fidAllIvestmetAndExpences",investOrExpacesController.fidAllIvestmetAndExpences)

investOrExpenncesRouts.get("/findSingleIvestmetOrExpences/:investOrExpennces_id/:memberId",investOrExpacesController.findSingleIvestmetAndExpences)


export default investOrExpenncesRouts;
