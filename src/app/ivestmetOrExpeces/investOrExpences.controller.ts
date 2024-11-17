import asyncCatch from '../../utility/asynncCatch';
import responseHandeler from '../../utility/responseHandeler';
import { investOrExpencesServeces } from './investOrExpences.serveces';

const createInvestOrExpaces = asyncCatch(async (req, res) => {
  const { payload } = req.body;
  const result = await investOrExpencesServeces.createInvestOrExpaces(payload)
  responseHandeler(res,{
    success:true,
    status:200,
    message:"new expence or invesment Crated",
    data:result
  })
});

export const investOrExpacesController = {
  createInvestOrExpaces,
};
