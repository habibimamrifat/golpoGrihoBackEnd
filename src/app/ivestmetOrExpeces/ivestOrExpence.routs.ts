import express from 'express';
import { investOrExpacesController } from './investOrExpences.controller';
const investOrExpenncesRouts = express.Router();

investOrExpenncesRouts.post("/createInvestOrExpaces/:adminOrVPOrPId",investOrExpacesController.createInvestOrExpaces)


export default investOrExpenncesRouts;
