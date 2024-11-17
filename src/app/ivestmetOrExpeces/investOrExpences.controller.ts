import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';
import { investOrExpencesServeces } from './investOrExpences.serveces';

const createInvestOrExpaces = asyncCatch(async (req, res) => {
  const payload = req.body;
  const { adminOrVPOrPId } = req.params;
  console.log(payload, adminOrVPOrPId);
  const result = await investOrExpencesServeces.createInvestOrExpaces(payload);
  responseHandeler(res, {
    success: true,
    status: 200,
    message: 'new expence or invesment Crated',
    data: result,
  });
});

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
  const { investOrExpennces_id, memberId }=req.params;
  const result = await investOrExpencesServeces.findSingleIvestmetAndExpences(
    investOrExpennces_id,
    memberId,
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
};
