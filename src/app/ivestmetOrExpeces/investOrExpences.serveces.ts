import { TIvestOrExpennces } from './investOrExpence.interface';
import { InvestOrExpensesModel } from './investOrExpence.model';

const createInvestOrExpaces = async (payload: TIvestOrExpennces) => {
  const result = await InvestOrExpensesModel.create(payload);
  return result;
};
export const investOrExpencesServeces = {
  createInvestOrExpaces,
};
