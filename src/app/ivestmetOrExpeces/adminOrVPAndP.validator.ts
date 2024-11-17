import asyncCatch from "../../utility/asynncCatch";
import { UserModel } from "../user/user.model";



const admiOrPrecedentOrVpValidatr=asyncCatch(async (req, res, next)=>{
    const {adminOrVPOrPId} = req.params
    const isadminOrVPOrPId = await UserModel.findOne({id:adminOrVPOrPId, role:{$in:["precident","vicePrecident","admin"]}})
    if(isadminOrVPOrPId)
    {
        next()
    }
    else
    {
        throw new Error("You dont have asdmin access")
    }
})
export default admiOrPrecedentOrVpValidatr