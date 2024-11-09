import asyncCatch from '../../utility/asynncCatch';
import { depositServices } from './deposit.services';

const createDeposit = asyncCatch(async (req, res) => {
  const depositData = req.body;
  const result = await depositServices.createDeposit(depositData);
  res.status(200).json({
    success: true,
    message: 'deposit created successfully',
    body: result,
  });
});

const makeADeposit = asyncCatch(async (req, res) => {
  const depositData = req.body;
  const result = await depositServices.makeADeposit(depositData);
  res.status(200).json({
    success: true,
    message: 'deposit created successfully',
    body: result,
  });
});

export const depositController = {
  createDeposit,makeADeposit
};
