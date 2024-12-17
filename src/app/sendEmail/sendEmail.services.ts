import emailSendBulkOrSingle from "../../utility/emailSendBulkOrSingle";
import { TSendEmail } from "./sendEmail.interface";


const sendEmail = async (payload:TSendEmail) => {
  const { sendTo, subject, message } = payload;

  const messageModifyed=`<div>${message}</div>`

  await emailSendBulkOrSingle(sendTo,subject,messageModifyed)

  return({
    message:"email send successfully"
  })
};
export const sendEmailServices = {
  sendEmail
};
