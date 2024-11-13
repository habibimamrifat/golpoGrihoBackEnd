import { UserModel } from "../user/user.model";
import asyncCatch from "../../utility/asynncCatch";

const adminValidator=asyncCatch(async (req, res, next)=>{
    const {adminId} = req.params
    const isAdmin = await UserModel.findOne({id:adminId, role:"admin"})
    if(isAdmin)
    {
        next()
    }
    else
    {
        throw new Error("You dont have asdmin access")
    }
})
export default adminValidator