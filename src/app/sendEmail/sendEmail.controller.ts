import asyncCatch from "../../utility/asynncCatch";
import responseHandeler from "../../utility/responseHandeler";
import { sendEmailServices } from "./sendEmail.services";

const sendEmail = asyncCatch(async(req,res,next)=>{
const payLoad = req.body
const result = await sendEmailServices.sendEmail(payLoad)
responseHandeler(res, {
    status: 200,
    success: true,
    message: 'Email have been sent',
    data: result,
  });
})

export const sendEmailConreoller={
    sendEmail
}