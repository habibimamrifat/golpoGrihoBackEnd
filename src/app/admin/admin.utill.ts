import { UserModel } from "../user/user.model"

const rollCheck = async(role:string)=>{
    const isFound = await UserModel.findOne({role:role})
    console.log(isFound)
    return isFound;
}
export const adminUtill = {
    rollCheck
}