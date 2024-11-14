import asyncCatch from "../../utility/asynncCatch";
import { UserModel } from "../user/user.model";



const precedentOrVpValidatr=asyncCatch(async (req, res, next)=>{
    const {VpOrPId} = req.params
    const isVpOrPId = await UserModel.findOne({id:VpOrPId, role:{$in:["precident","vicePrecident"]}})
    if(isVpOrPId)
    {
        next()
    }
    else
    {
        throw new Error("You dont have asdmin access")
    }
})
export default precedentOrVpValidatr