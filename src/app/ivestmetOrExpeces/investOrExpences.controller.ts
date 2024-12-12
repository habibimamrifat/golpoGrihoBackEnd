import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';
import { investOrExpencesServeces } from './investOrExpences.serveces';

const createInvestOrExpaces = asyncCatch(async (req, res) => {
  const payload = req.body;
  const result = await investOrExpencesServeces.createInvestOrExpaces(payload);
  responseHandeler(res, {
    success: true,
    status: 200,
    message: 'new expence or invesment Crated',
    data: result,
  });
});

const giveAInputInInvestmentCycle =asyncCatch(async (req, res) => {
  const payload = req.body;
  // const { adminOrVPOrPId } = req.params;
  
  const result = await investOrExpencesServeces.giveAInputInInvestmentCycle(payload);
  responseHandeler(res, {
    success: true,
    status: 200,
    message: 'Added to Investment Cycle',
    data: result,
  });
})

const disContinueANInvestment =asyncCatch(async (req, res) => {
  const { investmentId } = req.params;
  
  const result = await investOrExpencesServeces.disContinueANInvestment(investmentId);
  responseHandeler(res, {
    success: true,
    status: 200,
    message: 'Added to Investment Cycle',
    data: result,
  });
})

const fidAllIvestmetAndExpences = asyncCatch(async (req, res) => {
  const result = await investOrExpencesServeces.fidAllIvestmetAndExpences();
  responseHandeler(res, {
    success: true,
    status: 200,
    message: 'All Ivestmet And Expences Found',
    data: result,
  });
});

const findSingleIvestmetAndExpences = asyncCatch(async (req, res) => {
  const { investOrExpenncesId }=req.params;
  const result = await investOrExpencesServeces.findSingleIvestmetAndExpences(
    investOrExpenncesId
  );
  responseHandeler(res, {
    success: true,
    status: 200,
    message: 'All Ivestmet And Expences Found',
    data: result,
  });
});

export const investOrExpacesController = {
  createInvestOrExpaces,
  fidAllIvestmetAndExpences,
  findSingleIvestmetAndExpences,
  giveAInputInInvestmentCycle,
  disContinueANInvestment
};
