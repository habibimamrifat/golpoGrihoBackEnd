import asyncCatch from "../../utility/asynncCatch";
import responseHandeler from "../../utility/responseHandeler";
import { vpOrPServices } from "./vpOrP.services";

const findAllWaitingInstallment = asyncCatch(async(req,res)=>{
 const result =await vpOrPServices.findAllWaitingInstallment()
 responseHandeler(res,
    {
        status:200,
        success:true,
        message:"all waitiing InstallmentFound",
        data:result
    }
 )
})

const approveOrDeclineAnInstallment = asyncCatch(async(req,res)=>{
    const {VpOrPId}= req.params
    const {id, installmentStatus}= req.body
    const result =await vpOrPServices.approveOrDeclineAnInstallment(VpOrPId,id,installmentStatus)
    responseHandeler(res,
       {
           status:200,
           success:true,
           message:"installment accepted",
           data:result
       }
    )
   })

export const vpOrPController = {
    findAllWaitingInstallment,approveOrDeclineAnInstallment
}