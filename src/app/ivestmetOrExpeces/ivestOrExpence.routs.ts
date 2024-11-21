import express from 'express';
import { investOrExpacesController } from './investOrExpences.controller';
import admiOrPrecedentOrVpValidatr from './adminOrVPAndP.validator';
import validator from '../../middleware/validator';
import { InvestmentCycleIputZodValSchema, InvestOrExpensesZodValSchema } from './invesrtmentOrExpeces.validator';
const investOrExpenncesRouts = express.Router();

investOrExpenncesRouts.post("/createInvestOrExpaces/:adminOrVPOrPId",admiOrPrecedentOrVpValidatr,validator(InvestOrExpensesZodValSchema),investOrExpacesController.createInvestOrExpaces)

investOrExpenncesRouts.patch("/giveAInputInInvestmentCycle/:adminOrVPOrPId",admiOrPrecedentOrVpValidatr,validator(InvestmentCycleIputZodValSchema),investOrExpacesController.giveAInputInInvestmentCycle)

investOrExpenncesRouts.patch("/disContinueANInvestment/:adminOrVPOrPId/:investmentId",admiOrPrecedentOrVpValidatr,investOrExpacesController.disContinueANInvestment)

investOrExpenncesRouts.get("/fidAllIvestmetAndExpences",investOrExpacesController.fidAllIvestmetAndExpences)

investOrExpenncesRouts.get("/findSingleIvestmetOrExpences/:investOrExpenncesId",investOrExpacesController.findSingleIvestmetAndExpences)


export default investOrExpenncesRouts;
