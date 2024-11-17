import express from 'express';
import { investOrExpacesController } from './investOrExpences.controller';
import admiOrPrecedentOrVpValidatr from './adminOrVPAndP.validator';
import validator from '../../middleware/validator';
import { InvestOrExpensesZodValSchema } from './invesrtmentOrExpeces.validator';
const investOrExpenncesRouts = express.Router();

investOrExpenncesRouts.post("/createInvestOrExpaces/:adminOrVPOrPId",admiOrPrecedentOrVpValidatr,validator(InvestOrExpensesZodValSchema),investOrExpacesController.createInvestOrExpaces)

investOrExpenncesRouts.get("/fidAllIvestmetAndExpences",investOrExpacesController.fidAllIvestmetAndExpences)

investOrExpenncesRouts.get("/findSingleIvestmetOrExpences/:investOrExpennces_id/:memberId",investOrExpacesController.findSingleIvestmetAndExpences)


export default investOrExpenncesRouts;
