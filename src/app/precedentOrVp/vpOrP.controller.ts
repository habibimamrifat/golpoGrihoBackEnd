import asyncCatch from '../../utility/asynncCatch';
import getIdFromJwtToken from '../../utility/getIDFromJwtToken';
import responseHandeler from '../../utility/responseHandeler';
import { vpOrPServices } from './vpOrP.services';

const findAllWaitingInstallment = asyncCatch(async (req, res) => {
  const result = await vpOrPServices.findAllWaitingInstallment();
  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'all waitiing InstallmentFound',
    data: result,
  });
});

const approveOrDeclineAnInstallment = asyncCatch(async (req, res) => {
  const { authorization } = req.headers;

  const VpOrPId = getIdFromJwtToken(authorization as string);

  const { membrId, installmentStatus } = req.body;
  //   console.log(req.body);
  const result = await vpOrPServices.approveOrDeclineAnInstallment(
    VpOrPId,
    membrId,
    installmentStatus,
  );

  //   console.log("from controller",result)

  responseHandeler(res, {
    status: 200,
    success: true,
    message: 'installment accepted',
    data: result,
  });
});

export const vpOrPController = {
  findAllWaitingInstallment,
  approveOrDeclineAnInstallment,
};
